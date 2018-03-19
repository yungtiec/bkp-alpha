module.exports = [{
    id: 1,
    name: "Digital Gold",
    symbol: "DG",
    project_surveys: [
      {
        id: 1,
        survey_id: 1,
        project_id: 1,
        submitted: true,
        reviewed: false,
        survey: {
          id: 1,
          creator_id: 1,
          creator: {
            id: 1,
            last_name: "chu",
            first_name: "tammy",
            email: "tctammychu@gmail.com"
          },
          description: "Mauris semper diam et dui ullamcorper ultrices. Nam aliquam ipsum sed ante ullamcorper tempus. Donec ac odio et diam porta ultricies eu ac ipsum. Proin fermentum dui nec odio egestas, eget rutrum libero dignissim. Sed vel erat nibh. Ut et bibendum erat. In et eleifend mi, ut condimentum neque. In sodales eu eros quis porttitor. Nunc ultricies mattis ligula, a finibus erat ullamcorper in. Aenean eleifend dapibus justo, at finibus ligula. Etiam quis dictum libero.",
          survey_questions: [
            {
              id: 1,
              question: {
                text: "What is the Token description?",
                subcategory_id: 1,
                question_order: 1
              },
              survey_answers: [
                {
                  id: 1,
                  project_id: 1,
                  survey_question_id: 1,
                  answer:
                    "Maecenas malesuada nunc eget orci malesuada, a tincidunt nunc sagittis. Donec faucibus fermentum placerat. Ut bibendum purus vel viverra vehicula. Ut in arcu vitae turpis rhoncus fermentum. Integer varius malesuada dictum. Vestibulum placerat auctor eros in luctus. Ut at sem arcu. Sed commodo maximus malesuada. Morbi consequat lectus felis, eu malesuada metus placerat vitae. In porta dui non odio efficitur, at congue leo dapibus. Suspendisse potenti.",
                  references: []
                }
              ]
            },
            {
              id: 2,
              question: {
                text:
                  "What is the Token type (e.g. currency, utility token, or security)?",
                subcategory_id: 1,
                question_order: 2
              },
              survey_answers: [
                {
                  id: 2,
                  project_id: 1,
                  survey_question_id: 2,
                  answer: "utility token",
                  references: []
                }
              ]
            },
            {
              id: 3,
              question: {
                text:
                  "For Utility Token, is utility a license or a consumable?",
                subcategory_id: 1,
                question_order: 3
              },
              survey_answers: [
                {
                  id: 3,
                  project_id: 1,
                  survey_question_id: 3,
                  answer: "consumable",
                  references: []
                }
              ]
            },
            {
              id: 4,
              question: {
                text:
                  "For Non-utility Token, is token a currency or representative ownership?",
                subcategory_id: 1,
                question_order: 4
              },
              survey_answers: [
                {
                  id: 4,
                  project_id: 1,
                  survey_question_id: 4,
                  answer: "",
                  references: []
                }
              ]
            },
            {
              id: 5,
              question: {
                text: "According to the Project, is the Token a security?",
                subcategory_id: 1,
                question_order: 5
              },
              survey_answers: [
                {
                  id: 5,
                  project_id: 1,
                  survey_question_id: 5,
                  answer:
                    "Ut pretium fermentum nulla, et efficitur ante mattis in. In hac habitasse platea dictumst. Morbi vel augue facilisis, viverra nisi ut, gravida ligula. In vulputate est non justo elementum gravida. Nam viverra elit velit, quis consequat mauris ultrices facilisis. Vestibulum vitae risus et ligula ullamcorper commodo. Phasellus ac bibendum orci. Cras accumsan pulvinar lorem, eu aliquet turpis malesuada sed. Fusce vitae mattis diam.",
                  references: []
                }
              ]
            },
            {
              id: 6,
              question: {
                text:
                  "Why would people buy your Token now and in the future? Who are the target Token buyers?",
                subcategory_id: 2,
                question_order: 1
              },
              survey_answers: [
                {
                  id: 6,
                  project_id: 1,
                  survey_question_id: 6,
                  answer:
                    "Vestibulum accumsan ultricies lectus quis porta. Nulla viverra auctor mi, vitae iaculis arcu pulvinar non. Integer eget nisl semper, viverra enim id, dignissim mi. Cras tristique, nisl in tincidunt rhoncus, ex ligula suscipit ipsum, sit amet mollis mauris sem sit amet ex. Integer tincidunt, lectus ac rhoncus sagittis, sem neque elementum nisl, in tincidunt tellus augue non nisl. Nulla scelerisque tortor non nunc tristique, at imperdiet sem luctus. Nulla sollicitudin aliquet neque nec gravida. Mauris erat leo, bibendum sit amet ipsum vulputate, scelerisque congue ex. Donec et nibh libero. Cras quis tristique leo, non posuere justo. Quisque sit amet justo blandit, varius nunc nec, aliquet velit. Ut at nulla eros. Aenean auctor lectus non ex pulvinar consequat. Praesent nisi risus, placerat at elit eget, suscipit volutpat ante. Pellentesque sit amet faucibus ex. In eros nulla, commodo in augue sit amet, varius ullamcorper velit.",
                  references: []
                }
              ]
            },
            {
              id: 7,
              question: {
                text:
                  "What would the success of the project mean for the Token and Token holders?",
                subcategory_id: 2,
                question_order: 2
              },
              survey_answers: [
                {
                  id: 7,
                  project_id: 1,
                  survey_question_id: 7,
                  answer:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla rhoncus tincidunt porta. Etiam euismod, tellus eu vulputate maximus, tortor neque semper metus, quis egestas odio lacus at magna. Nullam congue luctus felis, in placerat mi vulputate placerat. Aenean cursus commodo nisl ac rutrum. Proin ultrices imperdiet ligula, a gravida purus sagittis in. Curabitur at diam a orci vulputate aliquam commodo nec est. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras iaculis porttitor velit, a vehicula eros tincidunt quis. Duis ac rutrum enim. Donec molestie sollicitudin metus, vitae dignissim turpis mollis vitae. Suspendisse pretium fermentum orci at aliquet. Morbi sodales ligula sapien, eget placerat ligula tempus at.",
                  references: []
                }
              ]
            },
            {
              id: 8,
              question: {
                text: "What are the Token economics?",
                subcategory_id: 2,
                question_order: 3
              },
              survey_answers: [
                {
                  id: 8,
                  project_id: 1,
                  survey_question_id: 8,
                  answer:
                    "Etiam facilisis lectus quis luctus tristique. Donec in laoreet dui. Aliquam vitae finibus justo. Vestibulum in justo purus. Sed interdum ipsum id massa tempor, a efficitur urna consectetur. Ut facilisis odio nec urna molestie, eget gravida elit maximus. Phasellus lacinia, est eget consectetur consequat, est odio auctor diam, id malesuada arcu lectus quis nulla. Fusce erat massa, imperdiet volutpat volutpat vitae, aliquam ac neque. Nulla hendrerit eros nec diam laoreet, ut lobortis ex tincidunt.",
                  references: []
                }
              ]
            },
            {
              id: 9,
              question: {
                text: "How many token have been created?",
                subcategory_id: 2,
                question_order: 1
              },
              survey_answers: [
                {
                  id: 9,
                  project_id: 1,
                  survey_question_id: 9,
                  answer: "10000000000",
                  references: []
                }
              ]
            },
            {
              id: 10,
              question: {
                text:
                  "What Token allocations and lockup / restrictions have been defined?",
                subcategory_id: 2,
                question_order: 2
              },
              survey_answers: [
                {
                  id: 10,
                  project_id: 1,
                  survey_question_id: 10,
                  answer:
                    "Mauris semper diam et dui ullamcorper ultrices. Nam aliquam ipsum sed ante ullamcorper tempus. Donec ac odio et diam porta ultricies eu ac ipsum. Proin fermentum dui nec odio egestas, eget rutrum libero dignissim. Sed vel erat nibh. Ut et bibendum erat. In et eleifend mi, ut condimentum neque. In sodales eu eros quis porttitor. Nunc ultricies mattis ligula, a finibus erat ullamcorper in. Aenean eleifend dapibus justo, at finibus ligula. Etiam quis dictum libero.",
                  references: []
                }
              ]
            },
            {
              id: 11,
              question: {
                text:
                  "What is the token supply mechanism for additional tokens to be created in the future (if any)?",
                subcategory_id: 2,
                question_order: 3
              },
              survey_answers: [
                {
                  id: 11,
                  project_id: 1,
                  survey_question_id: 11,
                  answer:
                    "Suspendisse potenti. Vivamus nec augue varius, mattis lectus at, maximus ligula. Cras aliquet velit vel lectus posuere, nec lacinia est sagittis. Pellentesque ultrices tincidunt faucibus. Morbi in molestie nulla. Phasellus ultricies tempus porttitor. Vestibulum ultricies placerat facilisis. Ut eleifend porta ante et vestibulum. Mauris malesuada vulputate dignissim. Duis tincidunt dolor mauris, quis rhoncus quam hendrerit ac. Ut tincidunt sit amet leo ut volutpat. Maecenas congue sem vel sapien elementum, eget laoreet leo auctor. Duis feugiat convallis malesuada.",
                  references: []
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    id: 2,
    name: "Hello Coin",
    symbol: "HC",
    project_surveys: [
      {
        id: 2,
        survey_id: 2,
        project_id: 2,
        submitted: true,
        reviewed: false,
        survey: {
          id: 2,
          creator_id: 1,
          creator: {
            id: 1,
            last_name: "chu",
            first_name: "tammy",
            email: "tctammychu@gmail.com"
          },
          description: "Mauris semper diam et dui ullamcorper ultrices. Nam aliquam ipsum sed ante ullamcorper tempus. Donec ac odio et diam porta ultricies eu ac ipsum. Proin fermentum dui nec odio egestas, eget rutrum libero dignissim. Sed vel erat nibh. Ut et bibendum erat. In et eleifend mi, ut condimentum neque. In sodales eu eros quis porttitor. Nunc ultricies mattis ligula, a finibus erat ullamcorper in. Aenean eleifend dapibus justo, at finibus ligula. Etiam quis dictum libero.",
          survey_questions: [
            {
              id: 1,
              question: {
                text: "What is the Token description?",
                subcategory_id: 1,
                question_order: 1
              },
              survey_answers: [
                {
                  id: 1,
                  project_id: 2,
                  survey_question_id: 1,
                  answer:
                    "Maecenas malesuada nunc eget orci malesuada, a tincidunt nunc sagittis. Donec faucibus fermentum placerat. Ut bibendum purus vel viverra vehicula. Ut in arcu vitae turpis rhoncus fermentum. Integer varius malesuada dictum. Vestibulum placerat auctor eros in luctus. Ut at sem arcu. Sed commodo maximus malesuada. Morbi consequat lectus felis, eu malesuada metus placerat vitae. In porta dui non odio efficitur, at congue leo dapibus. Suspendisse potenti.",
                  references: []
                }
              ]
            },
            {
              id: 2,
              question: {
                text:
                  "What is the Token type (e.g. currency, utility token, or security)?",
                subcategory_id: 1,
                question_order: 2
              },
              survey_answers: [
                {
                  id: 2,
                  project_id: 2,
                  survey_question_id: 2,
                  answer: "utility token",
                  references: []
                }
              ]
            },
            {
              id: 3,
              question: {
                text:
                  "For Utility Token, is utility a license or a consumable?",
                subcategory_id: 1,
                question_order: 3
              },
              survey_answers: [
                {
                  id: 3,
                  project_id: 2,
                  survey_question_id: 3,
                  answer: "consumable",
                  references: []
                }
              ]
            },
            {
              id: 4,
              question: {
                text:
                  "For Non-utility Token, is token a currency or representative ownership?",
                subcategory_id: 1,
                question_order: 4
              },
              survey_answers: [
                {
                  id: 4,
                  project_id: 2,
                  survey_question_id: 4,
                  answer: "",
                  references: []
                }
              ]
            },
            {
              id: 5,
              question: {
                text: "According to the Project, is the Token a security?",
                subcategory_id: 1,
                question_order: 5
              },
              survey_answers: [
                {
                  id: 5,
                  project_id: 2,
                  survey_question_id: 5,
                  answer:
                    "Ut pretium fermentum nulla, et efficitur ante mattis in. In hac habitasse platea dictumst. Morbi vel augue facilisis, viverra nisi ut, gravida ligula. In vulputate est non justo elementum gravida. Nam viverra elit velit, quis consequat mauris ultrices facilisis. Vestibulum vitae risus et ligula ullamcorper commodo. Phasellus ac bibendum orci. Cras accumsan pulvinar lorem, eu aliquet turpis malesuada sed. Fusce vitae mattis diam.",
                  references: []
                }
              ]
            },
            {
              id: 6,
              question: {
                text:
                  "Why would people buy your Token now and in the future? Who are the target Token buyers?",
                subcategory_id: 2,
                question_order: 1
              },
              survey_answers: [
                {
                  id: 6,
                  project_id: 2,
                  survey_question_id: 6,
                  answer:
                    "Vestibulum accumsan ultricies lectus quis porta. Nulla viverra auctor mi, vitae iaculis arcu pulvinar non. Integer eget nisl semper, viverra enim id, dignissim mi. Cras tristique, nisl in tincidunt rhoncus, ex ligula suscipit ipsum, sit amet mollis mauris sem sit amet ex. Integer tincidunt, lectus ac rhoncus sagittis, sem neque elementum nisl, in tincidunt tellus augue non nisl. Nulla scelerisque tortor non nunc tristique, at imperdiet sem luctus. Nulla sollicitudin aliquet neque nec gravida. Mauris erat leo, bibendum sit amet ipsum vulputate, scelerisque congue ex. Donec et nibh libero. Cras quis tristique leo, non posuere justo. Quisque sit amet justo blandit, varius nunc nec, aliquet velit. Ut at nulla eros. Aenean auctor lectus non ex pulvinar consequat. Praesent nisi risus, placerat at elit eget, suscipit volutpat ante. Pellentesque sit amet faucibus ex. In eros nulla, commodo in augue sit amet, varius ullamcorper velit.",
                  references: []
                }
              ]
            },
            {
              id: 7,
              question: {
                text:
                  "What would the success of the project mean for the Token and Token holders?",
                subcategory_id: 2,
                question_order: 2
              },
              survey_answers: [
                {
                  id: 7,
                  project_id: 2,
                  survey_question_id: 7,
                  answer:
                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla rhoncus tincidunt porta. Etiam euismod, tellus eu vulputate maximus, tortor neque semper metus, quis egestas odio lacus at magna. Nullam congue luctus felis, in placerat mi vulputate placerat. Aenean cursus commodo nisl ac rutrum. Proin ultrices imperdiet ligula, a gravida purus sagittis in. Curabitur at diam a orci vulputate aliquam commodo nec est. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Cras iaculis porttitor velit, a vehicula eros tincidunt quis. Duis ac rutrum enim. Donec molestie sollicitudin metus, vitae dignissim turpis mollis vitae. Suspendisse pretium fermentum orci at aliquet. Morbi sodales ligula sapien, eget placerat ligula tempus at.",
                  references: []
                }
              ]
            },
            {
              id: 8,
              question: {
                text: "What are the Token economics?",
                subcategory_id: 2,
                question_order: 3
              },
              survey_answers: [
                {
                  id: 8,
                  project_id: 2,
                  survey_question_id: 8,
                  answer:
                    "Etiam facilisis lectus quis luctus tristique. Donec in laoreet dui. Aliquam vitae finibus justo. Vestibulum in justo purus. Sed interdum ipsum id massa tempor, a efficitur urna consectetur. Ut facilisis odio nec urna molestie, eget gravida elit maximus. Phasellus lacinia, est eget consectetur consequat, est odio auctor diam, id malesuada arcu lectus quis nulla. Fusce erat massa, imperdiet volutpat volutpat vitae, aliquam ac neque. Nulla hendrerit eros nec diam laoreet, ut lobortis ex tincidunt.",
                  references: []
                }
              ]
            },
            {
              id: 9,
              question: {
                text: "How many token have been created?",
                subcategory_id: 2,
                question_order: 1
              },
              survey_answers: [
                {
                  id: 9,
                  project_id: 2,
                  survey_question_id: 9,
                  answer: "10000000000",
                  references: []
                }
              ]
            },
            {
              id: 10,
              question: {
                text:
                  "What Token allocations and lockup / restrictions have been defined?",
                subcategory_id: 2,
                question_order: 2
              },
              survey_answers: [
                {
                  id: 10,
                  project_id: 2,
                  survey_question_id: 10,
                  answer:
                    "Mauris semper diam et dui ullamcorper ultrices. Nam aliquam ipsum sed ante ullamcorper tempus. Donec ac odio et diam porta ultricies eu ac ipsum. Proin fermentum dui nec odio egestas, eget rutrum libero dignissim. Sed vel erat nibh. Ut et bibendum erat. In et eleifend mi, ut condimentum neque. In sodales eu eros quis porttitor. Nunc ultricies mattis ligula, a finibus erat ullamcorper in. Aenean eleifend dapibus justo, at finibus ligula. Etiam quis dictum libero.",
                  references: []
                }
              ]
            },
            {
              id: 11,
              question: {
                text:
                  "What is the token supply mechanism for additional tokens to be created in the future (if any)?",
                subcategory_id: 2,
                question_order: 3
              },
              survey_answers: [
                {
                  id: 11,
                  project_id: 2,
                  survey_question_id: 11,
                  answer:
                    "Suspendisse potenti. Vivamus nec augue varius, mattis lectus at, maximus ligula. Cras aliquet velit vel lectus posuere, nec lacinia est sagittis. Pellentesque ultrices tincidunt faucibus. Morbi in molestie nulla. Phasellus ultricies tempus porttitor. Vestibulum ultricies placerat facilisis. Ut eleifend porta ante et vestibulum. Mauris malesuada vulputate dignissim. Duis tincidunt dolor mauris, quis rhoncus quam hendrerit ac. Ut tincidunt sit amet leo ut volutpat. Maecenas congue sem vel sapien elementum, eget laoreet leo auctor. Duis feugiat convallis malesuada.",
                  references: []
                }
              ]
            }
          ]
        }
      }
    ]
  }
]
