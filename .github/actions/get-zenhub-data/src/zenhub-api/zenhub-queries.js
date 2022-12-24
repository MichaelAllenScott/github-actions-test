export const STORIES_ADDED_TO_BACKLOG = JSON.stringify({
	query: `
	{
		searchIssuesByPipeline(
			pipelineId: "Z2lkOi8vcmFwdG9yL1BpcGVsaW5lLzIzMDgxNDU"
			filters: {labels: {in: ["Dev Team"]}}
		)
		{
			nodes {
				title
				createdAt
			}
		}
	}
	`
});

export const STORIES_RELEASED_TO_PRODUCTION = JSON.stringify({
	query: `
	{
		searchClosedIssues(
		  workspaceId: "5fc9453d958e1600153602d5"
		  filters: {labels: {in: ["Dev Team"]}}
		) 
		{
			nodes {
				title
				closedAt
			}
		}
	}
	`
});

export const DEFECT_FIXES_RELEASED_TO_PRODUCTION = JSON.stringify({
	query: `
	{
		searchClosedIssues(
		  workspaceId: "5fc9453d958e1600153602d5"
		  filters: {labels: {in: ["Bug"]}}
		) 
		{
			nodes {
				title
				closedAt
			}
		}
	}
	`
});

export const STORY_LEAD_TIME = JSON.stringify({
	query: `
	{
		searchClosedIssues(
		  workspaceId: "5fc9453d958e1600153602d5"
		  filters: {labels: {in: ["Dev Team"]}}
		) {
		  nodes {
			title
			closedAt
			timelineItems {
				nodes {
					key
					data
					createdAt
					updatedAt
				}
			}
		  }
		}
	  }
	`
});

export const DEFECT_LEAD_TIME = JSON.stringify({
	query: `
	{
		searchClosedIssues(
		  workspaceId: "5fc9453d958e1600153602d5"
		  filters: {labels: {in: ["Bug"]}}
		) {
		  nodes {
			title
			closedAt
			timelineItems {
				nodes {
					key
					data
					createdAt
					updatedAt
				}
			}
		  }
		}
	  }
	`
});

export const OVERALL_LEAD_TIME = JSON.stringify({
	query: `
	{
		searchClosedIssues(
		  workspaceId: "5fc9453d958e1600153602d5"
		  filters: {labels: {in: ["Bug"]}, {in: ["Dev Team"]}}
		) {
		  nodes {
			title
			closedAt
			timelineItems {
				nodes {
					key
					data
					createdAt
					updatedAt
				}
			}
		  }
		}
	  }
	`
});