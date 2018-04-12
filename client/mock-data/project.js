module.exports = [{
  id: 2,
  name: "Virtual Poker",
  symbol: "VPP",
  description: "Virtue Poker is a privately held company headquartered in Gibraltar. It was founded in 2016, and is a Consensys backed startup. ",
  project_surveys: [{
    id: 2,
    survey_id: 2,
    project_id: 2,
    submitted: true,
    reviewed: false,
    name: "Consumer Token Disclosure (v1)",
    survey: {
      id: 2,
      creator_id: 1,
      creator: {
        id: 1,
        last_name: "",
        first_name: "The Brooklyn Project",
        email: ""
      },
      survey_questions: [{
          id: 1,
          question: {
            text: "Product description",
            subcategory_id: 1,
            question_order: 1
          },
          survey_answers: [{
            id: 1,
            project_id: 2,
            survey_question_id: 1,
            answer: "Virtue Poker (VP) plans to offer a blockchain-based online poker service. VP intends to solve the trust issues underlying online poker. Currently, online poker players must put their trust in the entity running the online poker game. By using the blockchain to run the game, the execution of the game is less prone to cheating and provides enhanced security for players.",
            references: []
          }]
        },
        {
          id: 3,
          question: {
            text: "Protocol description",
            subcategory_id: 2,
            question_order: 1
          },
          survey_answers: [{
              id: 3,
              project_id: 2,
              survey_question_id: 3,
              answer: "Ethereum smart contracts handle game registry, hold game money in escrow, and store game data. An “Interplanetary File System” (IFPS) will log all game history - taking advantage of blockchain’s immutable distributed ledgers. Shuffling is a series of randomizations and encryptions that ensures players can see only their cards.",
              references: []
            },
            {
              id: 4,
              project_id: 2,
              survey_question_id: 4,
              answer: "A proof of stake (PoS) consensus method will incentivize players to act as “justices” or nodes.",
              references: [3]
            },
            {
              id: 5,
              project_id: 2,
              survey_question_id: 5,
              answer: "These justices manage the rake system for VP, staking VPP for the chance to validate transactions and game activity in return for a small percentage of these transactions. The currency VPP can be used for tournaments and as an in-game currency, but is not a claim to the profits of VP itself.",
              references: [3, 4]
            }
          ]
        },
        {
          id: 2,
          question: {
            text: "User experience",
            subcategory_id: 2,
            question_order: 3
          },
          survey_answers: [{
            id: 2,
            project_id: 2,
            survey_question_id: 2,
            answer: "To play on VP, users have to download a desktop client, register on uPort, and fund a light wallet. After that, there’s no real UI difference between blockchain poker and existing online poker. While the underlying mechanics of the client and registration are more complex, the process itself should not be too complicated to deter user uptake.",
            references: []
          }]
        },
        {
          id: 4,
          question: {
            text: "Know-your-customer process",
            subcategory_id: 2,
            question_order: 4
          },
          survey_answers: [{
            id: 4,
            project_id: 2,
            survey_question_id: 4,
            answer: "Player identity in the form of an Ethereum address will be verified through uPort.",
            references: []
          }]
        },
        {
          id: 6,
          question: {
            text: "Market description",
            subcategory_id: 2,
            question_order: 2
          },
          survey_answers: [{
            id: 6,
            project_id: 2,
            survey_question_id: 6,
            answer: "The size of the online poker market is estimated at $2.5B per year.",
            references: []
          }]
        },
        {
          id: 7,
          question: {
            text: "Token sale cap",
            subcategory_id: 2,
            question_order: 1
          },
          survey_answers: [{
            id: 7,
            project_id: 2,
            survey_question_id: 7,
            answer: "For the April 25, 2018 sale, there is a hard cap of $12.5M.",
            references: []
          }]
        },
        {
          id: 23,
          question: {
            text: "Team description",
            subcategory_id: 2,
            question_order: 2
          },
          survey_answers: [{
              id: 23,
              project_id: 2,
              survey_question_id: 23,
              answer: "",
              link: "https://www.linkedin.com/in/jimkberry/",
              linkLabel: "Jim Berry (Lead Platform Developer)",
              references: []
            },
            {
              id: 24,
              project_id: 2,
              survey_question_id: 24,
              answer: "30+ years experience in several complex software development projects, spanning aerial imaging, medical research, and computer graphics. Did software development for both NASA and EA. ",
              references: [23]
            },
            {
              id: 25,
              project_id: 2,
              survey_question_id: 25,
              answer: "",
              link: "https://www.linkedin.com/in/columhiggins/",
              linkLabel: "Colum Higgins (Senior Product Manager)",
              references: [23, 24]
            },
            {
              id: 26,
              project_id: 2,
              survey_question_id: 26,
              answer: "10+ years experience as an enterprise consultant and CTO in supercomputing, telecom software, and online poker. PhD in physics from CERN. Experience working with the Chinese government and EU on telecom projects.",
              references: [23, 24, 25]
            },
            {
              id: 27,
              project_id: 2,
              survey_question_id: 27,
              link: "https://www.linkedin.com/in/dan-goldman-29b7714/",
              linkLabel: "Dan Goldman (CMO)",
              references: [23, 24, 25, 26]
            },
            {
              id: 28,
              project_id: 2,
              survey_question_id: 28,
              answer: "20+ years experience in online marketing, directed marketing for PokerStars, the world’s largest online poker company. Oversaw development of online casino game client for large US casinos.",
              references: [23, 24, 25, 26, 27]
            }
          ]
        },
        {
          id: 8,
          question: {
            text: "Team token lockups",
            subcategory_id: 2,
            question_order: 3
          },
          survey_answers: [{
            id: 8,
            project_id: 2,
            survey_question_id: 8,
            answer: "The team’s tokens are subject to lockups. Founder team stake is locked up for 4 years, with 25% of their supply becoming transferable each year. ",
            references: []
          }]
        },
        {
          id: 9,
          question: {
            text: "Transfer restrictions",
            subcategory_id: 2,
            question_order: 3
          },
          survey_answers: [{
            id: 9,
            project_id: 2,
            survey_question_id: 9,
            answer: "Tokens from initial offering non-transferable until mainnet launch.",
            references: []
          }]
        },
        {
          id: 10,
          question: {
            text: "Token sale - geographies excluded",
            subcategory_id: 2,
            question_order: 3
          },
          survey_answers: [{
            id: 10,
            project_id: 2,
            survey_question_id: 10,
            answer: "China and the United States",
            references: []
          }]
        },
        {
          id: 55,
          question: {
            text: "Analysis of competitors",
            subcategory_id: 2,
            question_order: 3
          },
          survey_answers: [{
            id: 55,
            project_id: 2,
            survey_question_id: 55,
            answer: "Pokerstars currently has ~70% of the market share for online poker.",
            references: []
          }, {
            id: 56,
            project_id: 2,
            survey_question_id: 56,
            answer: "VP is directly competing with CoinPoker and Acebusters. ",
            references: [55]
          }, {
            id: 57,
            project_id: 2,
            survey_question_id: 57,
            answer: "Acebusters attempted an ICO in September 2017, but was unable to reach its soft cap of 5,000 ETH ($1.3M at the time). ",
            references: [55, 56]
          }, {
            id: 58,
            project_id: 2,
            survey_question_id: 58,
            answer: "CoinPoker began their ICO in mid November, raising $52M over the following 2 months.",
            references: [55, 56, 57]
          }]
        }, {
          id: 61,
          question: {
            text: "Token sale offering structure:",
            subcategory_id: 2,
            question_order: 2
          },
          survey_answers: [{
              id: 61,
              project_id: 2,
              survey_question_id: 61,
              answer: "Sale Date: April 25 to May 9",
              references: []
            },
            {
              id: 62,
              project_id: 2,
              survey_question_id: 62,
              answer: "Soft, Hard Cap: $6M, $12.5M",
              references: [61]
            },
            {
              id: 63,
              project_id: 2,
              survey_question_id: 63,
              answer: "Total Tokens: 500M",
              references: [61, 62]
            },
            {
              id: 64,
              project_id: 2,
              survey_question_id: 64,
              answer: "Vesting: Not transferable until mainnet launch",
              references: [61, 62, 63]
            },
            {
              id: 65,
              project_id: 2,
              survey_question_id: 65,
              answer: "Accepts: Ethereum (ETH)",
              references: [61, 62, 63, 64]
            },
            {
              id: 66,
              project_id: 2,
              survey_question_id: 66,
              answer: "Sale Type: Dutch Auction",
              references: [61, 62, 63, 64, 65]
            },
            {
              id: 67,
              project_id: 2,
              survey_question_id: 67,
              answer: "Token Type: ERC223 Utility",
              references: [61, 62, 63, 64, 65, 66]
            },
            {
              id: 68,
              project_id: 2,
              survey_question_id: 68,
              answer: "Tokens Available for Sale: 100M (20%)",
              references: [61, 62, 63, 64, 65, 66, 67]
            },
            {
              id: 69,
              project_id: 2,
              survey_question_id: 69,
              answer: "Founder Stake: 86M (17.2%), 4 year lockup",
              references: [61, 62, 63, 64, 65, 66, 67, 68]
            },
            {
              id: 70,
              project_id: 2,
              survey_question_id: 70,
              answer: "Geographies Excluded: United States, China",
              references: [61, 62, 63, 64, 65, 66, 67, 68, 69]
            }
          ]
        }
      ]
    }
  }, {
    id: 3,
    survey_id: 3,
    project_id: 3,
    submitted: true,
    reviewed: false,
    name: "Third-party assessment",
    survey: {
      id: 3,
      creator_id: 1,
      creator: {
        id: 1,
        last_name: "Alkhayat",
        first_name: "Ozzi",
        email: ""
      },
      survey_questions: [{
          id: 22,
          question: {
            text: "Project strengths",
            subcategory_id: 1,
            question_order: 1
          },
          survey_answers: [{
            id: 22,
            project_id: 2,
            survey_question_id: 22,
            answer: "VP has exceptional connections and partnerships set up in both the poker sphere (such as Phil Ivey) and the development sphere (as a Consensys project).",
            references: []
          }, {
            id: 23,
            project_id: 2,
            survey_question_id: 23,
            answer: "VP plans to enter a growing market with a clear strategy for differentiation which would genuinely deliver value to players (more security) if successful.",
            references: [22]
          }, {
            id: 24,
            project_id: 2,
            survey_question_id: 24,
            answer: "The team’s depth and breadth of software expertise lowers the technical execution risk.",
            references: [22, 23]
          }, {
            id: 25,
            project_id: 2,
            survey_question_id: 25,
            answer: "Signs of informed ICO planning (ERC223 coin, founder stake vested, reasonable caps).",
            references: [22, 23, 24]
          }]
        },
        {
          id: 45,
          question: {
            text: "Project risks",
            subcategory_id: 2,
            question_order: 3
          },
          survey_answers: [{
            id: 45,
            project_id: 2,
            survey_question_id: 45,
            answer: "VP’s current following is relatively small, and their platform’s success is dependent on them establishing a substantial user base and gameplay volume.",
            references: []
          }, {
            id: 46,
            project_id: 2,
            survey_question_id: 46,
            answer: "Blockchain software may not effective at addressing current online poker security flaws or may be open to flaws of its own.",
            references: [45]
          }, {
            id: 47,
            project_id: 2,
            survey_question_id: 47,
            answer: "Accounts caught cheating can’t have transactions reversed to claw back funds unless there is a fork in the blockchain - they can only be banned.",
            references: [45, 46]
          }, {
            id: 48,
            project_id: 2,
            survey_question_id: 48,
            answer: "As it is built on the Ethereum platform, VP activity is tied to gas price and Ethereum network usage + development.",
            references: [45, 46, 47]
          }]
        },
        {
          id: 41,
          question: {
            text: "Outstanding questions",
            subcategory_id: 2,
            question_order: 3
          },
          survey_answers: [{
            id: 48,
            project_id: 2,
            survey_question_id: 48,
            answer: "How does Virtue Poker plan to capture users who are unaware of blockchain and don’t understand the possible benefits it could deliver?",
            references: []
          }, {
            id: 49,
            project_id: 2,
            survey_question_id: 49,
            answer: "Assuming no investment demand at all, and only transaction demand for  Virtue Poker gameplay and justice staking, what level of gameplay volume would translate to a breakeven for Virtue Poker?",
            references: [48]
          }, {
            id: 50,
            project_id: 2,
            survey_question_id: 50,
            answer: "Given that poker is a fairly commoditized service, how does Virtue Poker plan to differentiate itself from other blockchain poker companies?",
            references: [48, 49]
          }]
        }
      ]
    }
  }]
}];
