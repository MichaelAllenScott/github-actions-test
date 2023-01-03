const ZenhubIssueUtility = {
    filterIssuesForAssessmentDate(issueNodes, dateFieldToFilterOn) {
        const todayDate = new Date();
        const startDate = new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, 1);
        const endDate = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
    
        // Filter issues between current date and 1 month ago
        return issueNodes.filter(issue => {
            const issueDate = new Date(issue[dateFieldToFilterOn]);
            return issueDate >= startDate && issueDate <= endDate;
        });
    },
    
    // Return the average cycle time in days from array of issues with timelineItems included
    // Ex: Issue closedAt - last InProgress timelineItem date
    calculateCycleTimeInDays(issues) {
        if (!issues || issues.length === 0) return 0;
    
        let totalIssueTime = 0;
        let totalNumIssues = issues.length;
    
        // Traverse each issue and add the total time the issue took from latest 'In Progress' to closedAt date
        issues.forEach(issue => {

            // Find the date from the timelineItem where the issue was last moved into 'In Progress'
            let currLatestInProgDate;
            issue.timelineItems.nodes.forEach(timelineItem => {
                if (timelineItem.key === "issue.change_pipeline" && timelineItem.data.to_pipeline.name === "In Progress") {
                    
                    // If there is no current InProgress date or the current timelineItem InProgress date is later then last saved InProgress date, 
                    // then this is the new InProgress date to use
                    const itemInProgDate = new Date(timelineItem.createdAt);
                    if ( !currLatestInProgDate || currLatestInProgDate < itemInProgDate ) {
                        currLatestInProgDate = new Date(timelineItem.createdAt);
                    }
                }
            });
    
            // if currLatestInProgDate is closed then it's possible the ticket was closed without ever being in progress
            // We don't include those in the calc and remove them from total number of issues to average
            if (currLatestInProgDate) {
                const issueClosedAtDate = new Date(issue.closedAt);
                const timeDiff = issueClosedAtDate.getTime() - currLatestInProgDate.getTime();
                const dayDiff = timeDiff / (1000 * 3600 * 24);
                totalIssueTime += dayDiff;
                //console.log(`'${issue.title}': ${dayDiff} days`);
            } else {
                totalNumIssues--;
            }
        });
        
        const leadTime = totalIssueTime / totalNumIssues;
        //console.log(`${leadTime} = ${totalIssueTime} / ${totalNumIssues};`);
    
        return leadTime;
    },
    
    // Return the average lead time in days from array of issues
    // Ex: Issue closedAt - issue createdAt
    calculateLeadTimeInDays(issues) {
        if (!issues || issues.length === 0) return 0;
    
        let totalIssueTime = 0;
    
        issues.forEach(issue => {
            const issueClosedAtDate = new Date(issue.closedAt);
            const issueCreatedAtDate = new Date(issue.createdAt);
            const timeDiff = issueClosedAtDate.getTime() - issueCreatedAtDate.getTime();
            const dayDiff = timeDiff / (1000 * 3600 * 24);
            totalIssueTime += dayDiff;
            //console.log(`'${issue.title}': ${dayDiff} days`);
        });
        
        let leadTime = totalIssueTime / issues.length;
        //console.log(`${leadTime} = ${totalIssueTime} / ${issues.length};`);
    
        return leadTime;
    }
}

export default ZenhubIssueUtility;