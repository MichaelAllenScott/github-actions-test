import { setFailed, getInput } from '@actions/core';
import { ZenhubApi } from './zenhub-api/api';

(async function main() {
	
	const token = getInput( 'zenhub_token' );
	if ( !token ) {
	  setFailed( '`ZENHUB_TOKEN` is required. This is the Zenhub API Key and needs to be saved as a secret in the repo.' );
	  return;
	}

	const todayDate = new Date();
	const startDate = new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, 1);
	const endDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
	console.log(`Running PSC Report for ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}:`)

	const zenhubApi = new ZenhubApi(token);

	const storiesAddedToBacklog = await zenhubApi.getStoriesAddedToBacklog();
	console.log(`Stories Added to Backlog: ${storiesAddedToBacklog.length}`);

	const storiesReleasedToProd = await zenhubApi.getStoriesReleasedToProd();
	console.log(`Stories Released to Production: ${storiesReleasedToProd.length}`);

	const defectFixesReleasedToProd = await zenhubApi.getDefectFixesReleasedToProd();
	console.log(`Defect Fixes Released to Production: ${defectFixesReleasedToProd.length}`);

	const storyLeadTime = await zenhubApi.getStoryLeadTime();
	console.log(`Story Lead Time (days): ${storyLeadTime.toFixed(2)}`);

	const defectLeadTime = await zenhubApi.getDefectLeadTime();
	console.log(`Defect Lead Time (days): ${defectLeadTime.toFixed(2)}`);

	const overallLeadTime = await zenhubApi.getOverallLeadTime();
	console.log(`Overall Lead Time (days): ${overallLeadTime.toFixed(2)}`);

	const storyCycleTime = await zenhubApi.getStoryCycleTime();
	console.log(`Story Cycle Time (days): ${storyCycleTime.toFixed(2)}`);

	const defectCycleTime = await zenhubApi.getDefectCycleTime();
	console.log(`Defect Cycle Time (days): ${defectCycleTime.toFixed(2)}`);

	const overallCycleTime = await zenhubApi.getOverallCycleTime();
	console.log(`Overall Cycle Time (days): ${overallCycleTime.toFixed(2)}`);
})();