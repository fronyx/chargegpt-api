export const routeNeedsFewShotExamples = [
  {
    projectIds: [],
    user: `
      # Example description: POI category toilet for en-route stop required
      User request: I want to drive from Berlin to Munich and need a toilet on the way.
      Your response: `,
    assistant: '{ "route_need": "toilet" }',
  }, 
  {
    projectIds: [],
    user: `
      # Example description: POI category restaurant for en-route stop required
      User request: I want to drive from Porto to Munich. I want to eat at a restaurant on the way.
      Your response: `,
    assistant: '{ "route_need": "restaurant" }',
  },
  {
    projectIds: [],
    user: `
      # Example description: specific POI required for on the way
      User request: I want to drive to Prague. I want to eat at a McDonalds on the way.
      Your response: `,
    assistant: '{ "route_need": "McDonalds" }',
  },
  {
    projectIds: [],
    user: `
      # Example description: specific POI required for on the way
      User request: I want to plan a trip from Berlin to Munich. I want to stop at a McDonalds.
      Your response: `,
    assistant: '{ "route_need": "McDonalds" }',
  },
  {
    projectIds: [],
    user: `
      # Example description: specific POI required for on the way
      User request: I want to stop at a Subway on my way to Bochum.
      Your response: `,
    assistant: '{ "route_need": "Subway" }',
  },
  {
    projectIds: [],
    user: `
      # Example description: specific POI required for on the way
      User request: I want to stop at a McDonalds on my way to Bochum.
      Your response: `,
    assistant: '{ "route_need": "McDonalds" }',
  },
  {
    projectIds: [],
    user: `
      # Example description: no specific charge point requirement along the way
      User request: I want to drive to Bochum.
      Your response: `,
    assistant: 'null',
  },
  {
    projectIds: [],
    user: `
      # Example description: no specific charge point requirement along the way
      User request: I want to plan a trip from Berlin to Munich.
      Your response: `,
    assistant: 'null',
  },
  {
    projectIds: [],
    user: `
      # Example description: no specific charge point requirement along the way
      User request: I want to plan a trip from Prague to Essen.
      Your response: `,
    assistant: 'null',
  },
  {
    projectIds: [],
    user: `
      # Example description: no specific charge point requirement along the way
      User request: I want to plan a trip from Prague to Essen. I want to charge fast.
      Your response: `,
    assistant: 'null',
  },
  {
    projectIds: [],
    user: `
      # Example description: 'along the route' request for charging. Route need to identify is to get a coffee at a coffee shop
      User request: I want to plan a trip to Brussels. I want to charge on the way. I also want to get a coffee.
      Your response: `,
    assistant: '{ "route_need": "coffee shop" }',
  },
  {
    projectIds: [],
    user: `
      User request: I want to charge along the way to Berlin. Along the way, I want to stop at a place of interest.
      Your response: `,
    assistant: '{ "route_need": "tourist attraction" }',
  },
  {
    projectIds: [],
    user: `
      User request: I want to charge along the way from Munich to Ingolstadt. Along the way, I want to stop at a SevenEleven.
      Your response: `,
    assistant: '{ "route_need": "SevenEleven" }',
  },
  {
    projectIds: [],
    user: `
      User request: I want to charge along the way from Frankfurt to Berlin. Along the way, I want to stop at a Pfalzwerke charge point.I want to charge at a bakery.
      Your response: `,
    assistant: '{ "route_need": "bakery" }',
  },

  
  
]