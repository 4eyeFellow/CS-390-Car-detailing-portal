# SPRINT RETROSPECTIVE -- We Messed Up
Messing up is part of the process as long as we review and do better next time... Right...? Whoops.<br>
Sprint 1 was a learning curve. We followed the branching and pull request guidelines inconsistently at first, but by the end we had a clearer understanding of how to use them in future sprints. In our sprint retrospective, we discussed creating the Markdown document before we begin work and breaking down the rubric together so everyone has a much clearer understanding from the beginning of what procedures need to be followed, and a clearer understanding of not just the larger tasks but also the smaller pieces that need to be done, such as reviews and comments.

# UML Diagram

![UML Component Diagram](./umldiagram.png)

Created using PlantText. We chose a client-server architecture, because our software’s goal is to collect and store data about users and appointments, from various devices. While multiple pages may make up each component, the React website should be seen as having three main components: Accounts, Booking, and Staff Dashboard. Accounts features should handle sign-in and saving user information. Appointment Booking should guide clients through choosing, while storing, appointment related data. The Staff Dashboard should give employees and the owner special access to data about client loyalty and the ability to do necessary business management like editing appointment data and user roles. For the server, we use Supabase to access the same PostgreSQL database, giving us a secure, shared backend.




