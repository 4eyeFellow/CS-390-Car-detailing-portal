1. Elicitation Activity
</br>Date: October 4th, 2026
</br>Technique: Semi-Structured Interview
</br>Stakeholders: Small business owner Carson McConnell
</br>Team Members: Lily McConnell
</br>Activity Overview: Met in person to discuss a set of topics and questions determined by the rest of the team and adjusted during the interview by Lily to clarify, finished by presenting our intial proposed solution for feedback.

</br>2. Questions/Topics
</br>What does the current process look like?
</br>Pain points with the current system
</br>Solution essentials and key features
</br>Are there any aesthetic markers we need to adhere to?
</br>Opinions on the current mockup solution
</br>We have a full list of the questions linked under Outside-work-links.md, as well as the interview notes and recording

</br>3. Key Findings
</br>The primary problem with the current system is a lack of information organization and the tediousness of accessing customer information. There are no current automations in place, so the various contact points need to be checked and managed manually. The most important aspect of the solution is ease of use for the client. The solution should also be simple and minimalist so that clients can use it easily. Part of this is the ability to book an appointment on your phone as opposed to needing to open your laptop, however, this solution shouldn't use an app as that might raise the barrier to entry too high. While user accounts would be helpful, the priority is organizing client information with the appointment. Though the ability to cancel an appointment might make accounts more appealing. The solution should involve centralizing the information needed for a job into somewhere that is easy to access. The solution should also present the client with policies and requirements before they book the appointment. The information required about the car is less than expected. We primarily need to collect data on the condition of the car, as opposed to the make and model and other details. 

</br>4. Requirements Change Analysis

| # | Milestone 1 Requirement | Client Finding | Decision | Reason |
|---|---|---|---|---|
| 1 | **“As a mobile small business owner, I want to collect client car information, so that I can use that information to inform my job plan.”**<br><br>Users can input the details of their car, including make, model, color, size, and year. | **Significant missing feature: Selection of car condition.**<br><br>- Let client choose between good / average / bad condition<br>- Picture examples to help show what each condition means<br>- Use package + condition to estimate price and how long the job will take | Revise the criteria for this user story to include this requirement and its specifics. | Car condition is significant to both the price and how long the job may take. |
| 2 | **“As a mobile small business owner, I want to collect client car information, so that I can use that information to inform my job plan.”**<br><br>Users can input the details of their car, including make, model, color, size, and year. | The important car details include:<br><br>- Condition of the vehicle<br>- Any pre-existing damage<br>- For polishing, has the car ever been repainted? | Revise criteria for the user story to exclude unnecessary details of size, color, and year. Replace with the client’s desired details. | The client specified different car information than our original vision. |
| 3 | No previous sign-in/account requirement. | The client expressed a desire for accounts to store client history, such as for autofilling of information and loyalty recognition. | Add a user story to express the need for accounts so that user history can be saved, such as for autofilling of information and loyalty rewards. | Accounts are necessary to store individual user information. |
| 4 | No previous sign-in/account requirement. | The client has one unofficial employee and plans to utilize more help in the future, and thus may want others to be able to log in and view the admin dashboard. | Add to the user story expressing the need for accounts so that it includes the need for admin accounts so that the owner and employees can view the admin dashboard. | Because accounts are necessary for revision #3, accounts can also be used to give admin access. |
| 5 | **“As a mobile small business owner, I want the system to automatically calculate travel time to each of the clients, so that my schedule includes realistic and accurate drive time between jobs.”** | Client usually books about 2 hours longer than he thinks he will need to avoid overlap. If there is extra time, he can sometimes move the next person up. Gives clients around a 1-hour arrival range instead of an exact time. | Revise the user story’s criteria to include this 2-hour gap and 1-hour arrival range, as well as specifying this gap should be adjustable by the admin dashboard. | Our original vision did not account for this buffer in scheduling, and the client expressed a very specific system. |
| 6 | No existing requirement on allowing customers to cancel or alter appointments. | Client stated a new desired cancellation policy:<br><br>- More than a week out: okay to cancel/reschedule themselves<br>- Less than a week: would rather have them call<br>- Around 48 hours: eventually a small rescheduling fee / lose deposit for cancellation | Add a user story to include the ability to cancel and reschedule appointments based on the specific terms described by the client. | The client expressed a very specific policy for cancellations that should be outlined in the criteria. |
| 7 | **“As a client, I want to review a complete summary of my appointment, including selected services, total cost, date, time, and terms, before submitting my appointment, and receive a confirmation of these details by email, so that I can verify my appointment information and have a record of my booking.”** | - There are many important terms and conditions<br>- Terms and conditions would need to be written out and reviewed more specifically later | Revise the criteria for this user story to include that the displayed terms and conditions are able to be customized by admin. | Terms and policies are important, numerous, and may change over time. The client should have full, custom control over this, rather than our team trying to outline policies ourselves. |

</br>Finch Gerwe
</br>Developer/SCRUM Master
</br>Wrote up semi-structured interview, update the Project Overview, listed key findings, questions/topics, and elicitation activity
</br>Contribution: 25%

</br>Zeke Grant
</br>Developer
</br>Wrote up semi-structured interview, revise product backlog
</br>Contribution: 25%

</br>Lily Kate McConnell
</br>Developer/Project Owner
</br>Requirement change analysis, recorded and performed the semi-structured interview
</br>Contribution: 25%

</br>Jakub Nowicki
</br>Developer
</br>Wrote up semi-structured interview, revise product backlog
</br>Contribution: 25%
