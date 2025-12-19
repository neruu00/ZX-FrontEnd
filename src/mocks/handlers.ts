import { http, HttpResponse } from 'msw';

import { mockBookList } from './mockBookList';

const User = [
  {
    id: 'mikamoneru@google.com',
    nickname: '미카모 네루',
    image:
      'https://static.wikitide.net/bluearchivewiki/1/16/Neru_%28School_Uniform%29.png?version=dc7cf967e390853df68c8a7c59eb9ec5',
  },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export const handlers = [
  http.post(`${baseUrl}/api/login`, () => {
    return HttpResponse.json(User[0], {
      headers: {
        'Set-Cookie': 'connect.sid=msw-cookie;HttpOnly;Path=/',
      },
    });
  }),
  http.post(`${baseUrl}/api/logout`, () => {
    return new HttpResponse(null, {
      headers: {
        'Set-Cookie': 'connect.sid=;HttpOnly;Path=/;Max-Age=0',
      },
    });
  }),
  http.post(`${baseUrl}/api/signup`, async ({ request }) => {
    // return HttpResponse.text(JSON.stringify('user_exists'), {
    //   status: 403,
    // });
    return HttpResponse.text(JSON.stringify('ok'), {
      headers: {
        'Set-Cookie': 'connect.sid=msw-cookie;HttpOnly;Path=/',
      },
    });
  }),
  http.get(`${baseUrl}/api/open/book/aladin/list`, async ({ request }) => {
    // return HttpResponse.text(JSON.stringify('user_exists'), {
    //   status: 403,
    // });
    return HttpResponse.json(mockBookList);
  }),
];
