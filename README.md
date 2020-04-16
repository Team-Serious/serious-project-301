# serious-project-301

- Project Name:
AAA - Animal Adoption Application

- Team Members:
1. **Darah Shalabi**
3. **Batool Al Ali**
2. **Ruwaid Al Sayyed**
4. **Hussein Al Mohammed**

- A description of the project
This application will help users to search through a database for pets of their desired characteristics and add them to their list of adoption. A user can also rehome their pet by adding them to the database.


- The overall problem domain and how the project solves those problems
Looking through animal related websites around Jordan, we could not find an application that would help us view the pets that need a home. So we are building this tool to tackle this problem and allow the user to make a personal contribution by adding the animals they know that they need a place to be.

- Semantic versioning, beginning with version 1.0.0 and incremented as changes are made
v1.0.1 readme updates

- A list of any libraries, frameworks, or packages that your application requires in order to properly function
1. JQuery 
2. Express
3. Superagent
4. Postgres

- Instructions that the user may need to follow in order to get your application up and running on their own computer
 
**Given** that a user opens the application in their browser
**When** they will be displayed with the applications homepage
**Then** the website will allow them to know more and navigate throup the pages with easy accessability

1. As a user, I want to be able to search for pets to adopt, so that I can pich from the results.
2. As a user, I want to have the opportunity to add a new animal for adoption, so that it is in the database.
3. As a user, I want to have a place that collects all my previous interactions with the application, so that they are under my name and not lost when I visit the site again.

- Clearly defined API endpoints with sample responses
- '/' homepage 
- '/search' search page
- '/result/:animal_name' result page based on search process
- '/about' about page

- Clearly defined database schemas
1. Table for animal data
2. Table for user data