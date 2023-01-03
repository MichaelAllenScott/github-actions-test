import fetch from 'node-fetch';
import * as ZenhubQueries from './query-definitions';
import ZenhubIssueUtility from './issue-utility';

export class ZenhubApi{
  constructor(token) {
    this.token = token;
  }

  async makeRequest(body) {
    try {
      const response = await fetch(
        'https://api.zenhub.com//public/graphql',
        {
          method: 'post',
          body: body,
          headers: {
              'Content-Type': 'application/json',
              'User-Agent': 'Node',
              'Authorization': `Bearer ${this.token}`
          },
        }
      );
      const json = await response.json();
      return json.data;
    } catch (ex) {
      console.log(`Exception encountered while making Zenhub API call, Ex: ${ex}`);
    }
  }

  async getStoriesAddedToBacklog() {
    const response = await this.makeRequest(ZenhubQueries.STORIES_ADDED_TO_BACKLOG);
    const filteredIssues = ZenhubIssueUtility.filterIssuesForAssessmentDate(response.searchIssuesByPipeline.nodes, "createdAt");
    return filteredIssues;
  }

  async getStoriesReleasedToProd() {
      const response = await this.makeRequest(ZenhubQueries.STORIES_RELEASED_TO_PRODUCTION);
      const filteredIssues = ZenhubIssueUtility.filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");
      return filteredIssues;
  }

  async getDefectFixesReleasedToProd() {
      const response = await this.makeRequest(ZenhubQueries.DEFECT_FIXES_RELEASED_TO_PRODUCTION);
      const filteredIssues = ZenhubIssueUtility.filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");
      return filteredIssues;
  }

  async getStoryLeadTime() {
      const response = await this.makeRequest(ZenhubQueries.CLOSED_DEV_STORIES);
      const filteredIssues = ZenhubIssueUtility.filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");
      const storyLeadTime = ZenhubIssueUtility.calculateLeadTimeInDays(filteredIssues);
      return storyLeadTime;
  }

  async getDefectLeadTime() {
      const response = await this.makeRequest(ZenhubQueries.CLOSED_DEFECT_STORIES);
      const filteredIssues = ZenhubIssueUtility.filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");
      const defectLeadTime = ZenhubIssueUtility.calculateLeadTimeInDays(filteredIssues);
      return defectLeadTime;
  }

  async getOverallLeadTime() {
      const defectResponse = await this.makeRequest(ZenhubQueries.CLOSED_DEFECT_STORIES);
      const defectFilteredIssues = ZenhubIssueUtility.filterIssuesForAssessmentDate(defectResponse.searchClosedIssues.nodes, "closedAt");

      const response = await this.makeRequest(ZenhubQueries.CLOSED_DEV_STORIES);
      const filteredIssues = ZenhubIssueUtility.filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");

      const combinedIssues = filteredIssues.concat(defectFilteredIssues);
      const overallLeadTime = ZenhubIssueUtility.calculateLeadTimeInDays(combinedIssues);

      return overallLeadTime;
  }

  async getStoryCycleTime() {
      const response = await this.makeRequest(ZenhubQueries.CLOSED_DEV_STORIES);
      const filteredIssues = ZenhubIssueUtility.filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");
      const storyCycleTime = ZenhubIssueUtility.calculateCycleTimeInDays(filteredIssues);
      return storyCycleTime;
  }

  async getDefectCycleTime() {
      const response = await this.makeRequest(ZenhubQueries.CLOSED_DEFECT_STORIES);
      const filteredIssues = ZenhubIssueUtility.filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");
      const defectCycleTime = ZenhubIssueUtility.calculateCycleTimeInDays(filteredIssues);
      return defectCycleTime;
  }


  async getOverallCycleTime() {
      const response = await this.makeRequest(ZenhubQueries.CLOSED_DEV_STORIES);
      const filteredIssues = ZenhubIssueUtility.filterIssuesForAssessmentDate(response.searchClosedIssues.nodes, "closedAt");

      const defectResponse = await this.makeRequest(ZenhubQueries.CLOSED_DEFECT_STORIES);
      const defectFilteredIssues = ZenhubIssueUtility.filterIssuesForAssessmentDate(defectResponse.searchClosedIssues.nodes, "closedAt");

      const combinedIssues = filteredIssues.concat(defectFilteredIssues);
      const overallCycleTime = ZenhubIssueUtility.calculateCycleTimeInDays(combinedIssues);

      return overallCycleTime;
  }
}