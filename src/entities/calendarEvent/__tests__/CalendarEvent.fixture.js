export default {
  id: 1,
  creator: {
    id: 1,
    email: 'test@test.com',
    displayName: 'Test Test',
    self: true,
  },
  color: '#dec5ac',
  start: '2020-04-26T22:43:52.214Z',
  end: '2020-04-26T23:43:52.214Z',
  attendees: [
    {
      id: 1,
      email: 'test@test.com',
      displayName: 'Test Test',
      organizer: true,
      self: true,
      responseStatus: null,
      hide: false,
    },
    {
      id: 2,
      email: 'test2@test.com',
      displayName: 'Test2 Test',
      organizer: false,
      self: false,
      responseStatus: null,
      hide: true,
    },
    {
      id: 3,
      email: 'test3@test.com',
      displayName: 'Test3 Test',
      organizer: false,
      self: false,
      responseStatus: null,
      hide: true,
    },
  ],

};
