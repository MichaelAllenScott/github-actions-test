//import { setFailed, getInput, debug } from '@actions/core';
//import { context, getOctokit } from '@actions/github';
import ZenhubApi from './zenhub-api/zenhub-api';
import * as ZenhubQueries from './zenhub-api/zenhub-queries';

(async function main() {
	const storiesAddedToBacklog = await getStoriesAddedToBacklog();
	//console.log(storiesAddedToBacklog);
	console.log(`Stories Added to Backlog: ${storiesAddedToBacklog.length}`);

	const storiesReleasedToProd = await getStoriesReleasedToProd();
	//console.log(storiesReleasedToProd);
	console.log(`Stories Released to Production: ${storiesReleasedToProd.length}`);

	const defectFixesReleasedToProd = await getDefectFixesReleasedToProd();
	//console.log(defectFixesReleasedToProd);
	console.log(`Defect Fixes Released to Production: ${defectFixesReleasedToProd.length}`);

	const storyLeadTime = await getStoryLeadTime();
	console.log(`Story Lead Time (days): ${storyLeadTime.toFixed(2)}`);

	const defectLeadTime = await getDefectLeadTime();
	console.log(`Defect Lead Time (days): ${defectLeadTime.toFixed(2)}`);

	const overallLeadTime = await getOverallLeadTime();
	console.log(`Overall Lead Time (days): ${overallLeadTime.toFixed(2)}`);
})();

async function getStoriesAddedToBacklog() {
	const response = await ZenhubApi.makeRequest(ZenhubQueries.STORIES_ADDED_TO_BACKLOG);
	const filteredIssues = filterIssuesForAssessmentDate(response.searchIssuesByPipeline.nodes, "createdAt");
	return filteredIssues;
}

async function getStoriesReleasedToProd() {
	const response = await ZenhubApi.makeRequest(ZenhubQueries.STORIES_RELEASED_TO_PRODUCTION);
	const filteredIssues = filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");
	return filteredIssues;
}

async function getDefectFixesReleasedToProd() {
	const response = await ZenhubApi.makeRequest(ZenhubQueries.DEFECT_FIXES_RELEASED_TO_PRODUCTION);
	const filteredIssues = filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");
	return filteredIssues;
}

async function getStoryLeadTime() {
	const response = await ZenhubApi.makeRequest(ZenhubQueries.STORY_LEAD_TIME);
	const filteredIssues = filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");
	const storyLeadTime = calculateLeadTimeInDays(filteredIssues);
	return storyLeadTime;
}

async function getDefectLeadTime() {
	const response = await ZenhubApi.makeRequest(ZenhubQueries.DEFECT_LEAD_TIME);
	const filteredIssues = filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");
	const defectLeadTime = calculateLeadTimeInDays(filteredIssues);
	return defectLeadTime;
}

async function getOverallLeadTime() {
	const defectResponse = await ZenhubApi.makeRequest(ZenhubQueries.DEFECT_LEAD_TIME);
	const defectFilteredIssues = filterIssuesForAssessmentDate(defectResponse.searchClosedIssues.nodes, "closedAt");
	const defectLeadTime = calculateLeadTimeInDays(defectFilteredIssues);

	const response = await ZenhubApi.makeRequest(ZenhubQueries.STORY_LEAD_TIME);
	const filteredIssues = filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");
	const storyLeadTime = calculateLeadTimeInDays(filteredIssues);

	return (defectLeadTime + storyLeadTime) / 2;
}

function filterIssuesForAssessmentDate(issueNodes, dateFieldToFilterOn) {
	const endDate = new Date();
	const startDate = new Date();
	startDate.setMonth(startDate.getMonth() - 1);

	return issueNodes.filter(issue => {
		const issueDate = new Date(issue[dateFieldToFilterOn]);
		return issueDate >= startDate && issueDate <= endDate;
	});
}

function calculateLeadTimeInDays(filteredIssues) {
	if (!filteredIssues || filteredIssues.length === 0) return 0;

	var totalIssueTime = 0;
	let totalNumIssues = filteredIssues.length;

	for (let i = 0; i < filteredIssues.length; i++) {
		let issue = filteredIssues[i];
		let currLatestInProgDate;
		for (let j = 0; j < issue.timelineItems.nodes.length; j++) {
			let timelineItem = issue.timelineItems.nodes[j];
			if (timelineItem.key === "issue.change_pipeline" && timelineItem.data.to_pipeline.name === "In Progress") {
				let itemInProgDate = new Date(timelineItem.createdAt);
				if ( !currLatestInProgDate || currLatestInProgDate < itemInProgDate ) {
					currLatestInProgDate = new Date(timelineItem.createdAt);
				}
			}
		}

		// A ticket could be closed that was never in progress so we won't include those in the calc for now
		// var startMetricDate = currLatestInProgDate ? currLatestInProgDate : new Date(issue.createdAt);
		if (currLatestInProgDate) {
			var issueClosedAtDate = new Date(issue.closedAt);
			var timeDiff = issueClosedAtDate.getTime() - currLatestInProgDate.getTime();
			var dayDiff = timeDiff / (1000 * 3600 * 24);
			totalIssueTime += dayDiff;
			//console.log(`Issue ${i} - '${issue.title}': ${dayDiff} days`);
		} else {
			totalNumIssues--;
		}
	}
	
	var leadTime = totalIssueTime / totalNumIssues;
	//console.log(`${leadTime} = ${totalIssueTime} / ${totalNumIssues};`);

	return leadTime;
}

