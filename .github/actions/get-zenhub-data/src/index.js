import { setFailed, getInput } from '@actions/core';
import { ZenhubApi } from './zenhub-api/api';

(async function main() {
	
	const token = getInput( 'zenhub_token' );
	if ( !token ) {
	  setFailed( 'Input `zenhub_token` is required. This is the Zenhub API Key and needs to be saved as a secret in the repo.' );
	  return;
	}

	const zenhubApi = new ZenhubApi('zh_75f22679c48cc395af6cc7620f50b9591f17a43032bb4d9b071b2083c4dfa92f');

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