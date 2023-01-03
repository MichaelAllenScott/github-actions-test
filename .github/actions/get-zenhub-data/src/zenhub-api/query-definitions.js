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

export const CLOSED_DEV_STORIES = JSON.stringify({
	query: `
	{
		searchClosedIssues(
		  workspaceId: "5fc9453d958e1600153602d5"
		  filters: {labels: {in: ["Dev Team"]}}
		) {
		  nodes {
			title
			createdAt
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

export const CLOSED_DEFECT_STORIES = JSON.stringify({
	query: `
	{
		searchClosedIssues(
		  workspaceId: "5fc9453d958e1600153602d5"
		  filters: {labels: {in: ["Bug"]}}
		) {
		  nodes {
			title
			createdAt
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