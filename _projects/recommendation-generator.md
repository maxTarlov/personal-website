---
layout: page
title: LinkedIn Recommendation Generator
date: 2022-12-28
---

On LinkedIn, users can add concise, public notes to each others’ profiles recommending them to potential employers or clients. Many users may want to use ChatGPT or a similar large language model chatbot to write the recommendation for them, but this particular task is not well-suited for the chatbot interface. I designed a prototype application that provides a better experience to users who want to use a large language model to complete this task.

## The issue with chatbots

A layperson might start by simply asking the chatbot to write a recommendation without providing any further instruction, but the result is largely unhelpful. It is styled as a formal letter of recommendation more than 300 words long and it is extremely generic.

![User prompts ChatGPT "Write a recommendation for my former coworker Jan"; ChatGPT responds "To Whom It May Concern..."](/assets/images/ChatGPT-recommendation-screenshots/try1.png)

The logical next step would be to add a little detail to the prompt, so I clarify that I want a *LinkedIn* recommendation and add some information about Jan’s professional expertise. Unfortunately, the result is even worse! The recommendation is no longer styled as a formal letter of recommendation, but it is still way too long and now it is making up how long I have worked with her.

![User prompts ChatGPT "Write a LinkedIn recommendation for my former coworker Jan. She is a knowledgable computational linguist and talented prompt engineer"; ChatGPT responds "I am pleased to write a LinkedIn recommendation for my former coworker Jan. I had the privilage of working alongside Jan for several years, and I can wholeheartedly attest..."](/assets/images/ChatGPT-recommendation-screenshots/try2.png)

Let’s say I try one more time. I clarify how long I have worked together, and I specify that I want 150 words or less. The result is OK; a little stiff, pretty generic, and a bit too long still.

![User prompts ChatGPT "Write a LinkedIn recommendation for my former coworker Jan. She is a knowledgable computational linguist and talented prompt engineer. We worked together for one year as contractors at Google. 150 words or less"; ChatGPT responds "I had the pleasure of working alongside Jan for a year at Google, and I am thrilled to write this recommendation..."](/assets/images/ChatGPT-recommendation-screenshots/try3.png)

After three tries, a reasonable user might just assume that this is the best they can get from a large language model. But it isn’t. By reimagining the interface between the user and language model, we can create a less frustrating experience that provides better results. 

## An alternative solution

The main problem in the example above is that the chatbot interface places the burden of defining the task and identifying the necessary information required to complete that task on the user. Instead of having the user try to prompt the large language model (LLM), I have created a simple application that uses dynamic forms to prompt the user for the necessary information. The application then uses that information to prompt the LLM. Removing direct interaction with the LLM provides a much more predictable, less frustrating user experience.

![The LinkedIn Recommendation Generator app landing page prompts the user for the preferred name and pronouns for the person they are recommending. The user can optionally answer the question "Have you worked with this person?"](/assets/images/recommendation-generator-screenshots/step1.png)

When the user enters the application, they are asked for basic information about the person they are recommending. This information is used in the second step to present the user with a set of thought-provoking free-response questions.

![The user is presented with several questions, such as "What was Jan's role while you worked together?" and "Describe some of Jan's best characteristics." The user is prompted to choose some of these questions to answer and instructed to write at least 100 characters.](/assets/images/recommendation-generator-screenshots/step2-unfilled.png)

The user is instructed to answer 2-5 of the free-response questions. The answers they provide, as well as which questions they choose to answer, inform the content and style of the final recommendation.

![The user has chosen to answer three questions. Q: "What was Jan's role while you worked together?" A: "Jan and I were both contractors at Google for a year"; Q: "What is a particular strength of Jan's?" A: "Jan is a talented computational linguist and prompt engineer"; Q: "What are some of Jan's professional accomplishments?" A: "Jan spearheaded the transition from traditional NLP techniques to a large language model approach which modernized our team's processes"](/assets/images/recommendation-generator-screenshots/step2-filled.png)

Once the user submits the form, the data from steps one and two are gathered into an engineered prompt and sent to an LLM. The user is presented with three unique options, all of which stick to the facts provided and avoid overly generic language.

![The application provides three recommendations based on the user's responses: "Jan and I were contractors at Google for a year, where she was a computational linguist and prompt engineer. She was essential in the transition from NLP techniques to a modern approach using a large language model."; "Jan is a talented computational linguist and prompt engineer. She and I worked together at Google as contractors for a year. She is a strong and knowledgeable person. Jan has many accomplishments, but one of the most impressive was spearheading the transition from traditional NLP techniques to a large language model approach which modernized our team's processes."; "Jan and I worked together at Google as contractors for about a year. She's a talented computational linguist and prompt engineer, and her work has helped modernize the team's processes."](/assets/images/recommendation-generator-screenshots/results.png)

If you would like to try the prototype, you can visit [recommend.tarlov.dev](https://recommend.tarlov.dev). Please be mindful that this prototype costs me money to host. If you would like to use it frequently, please contact me.
