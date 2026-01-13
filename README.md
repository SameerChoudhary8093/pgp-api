<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## API Endpoints

### Users
| Method | Endpoint | Description | Auth | Body/Query |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/users/register` | Register a new user | No | `RegisterDto`: `{ name, email?, phone, address, gpId?, wardId?, localUnitId?, password, referralCode?, authUserId? }` |
| `GET` | `/users/me/summary` | Get current user's summary | Yes | - |
| `PATCH` | `/users/me` | Update current user profile | Yes | `UpdateProfileDto`: `{ photoUrl? }` |
| `GET` | `/users/me/recruitment-progress` | Get current user's recruitment progress | Yes | - |
| `POST` | `/users/me/photo` | Upload profile photo | Yes | FormData `file` |
| `GET` | `/users/:id/recruits` | Get recruits of a user | No | Query: `take` |
| `GET` | `/users/:id/summary` | Get user summary | No | - |
| `GET` | `/users/:id/recruitment-progress` | Get user recruitment progress | No | - |
| `GET` | `/users/leaderboard` | Get leaderboard | No | Query: `take` |
| `GET` | `/users/admin/users/search` | Search users | Admin | Query: `q`, `take` |
| `POST` | `/users/admin/users/:id/role` | Update user role | Admin | `UpdateRoleDto`: `{ role, actorUserId, reason }` |

### Admin Users
| Method | Endpoint | Description | Auth | Body/Query |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/admin/users/:id/promote-to-ppc` | Promote user to PPC | Admin | `{ actorUserId, reason }` |
| `POST` | `/admin/users/:id/promote-to-ssp` | Promote user to SSP | Admin | `{ actorUserId, reason }` |

### Audit
| Method | Endpoint | Description | Auth | Body/Query |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/audit/logs` | List audit logs | No | Query: `limit` |

### Committees
| Method | Endpoint | Description | Auth | Body/Query |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/admin/committees` | Create committee | Admin | `{ name, localUnitId, type, actorUserId, reason? }` |
| `POST` | `/admin/committees/:id/members` | Add member to committee | Admin | `{ userId, role, isPresident?, actorUserId, reason? }` |
| `GET` | `/cwc/my-team` | View CWC team | User | - |

### Elections
| Method | Endpoint | Description | Auth | Body/Query |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/elections` | List active elections | No | - |
| `GET` | `/elections/my-ballot` | Get my ballot | Yes | - |
| `GET` | `/elections/:id` | Get election details | No | - |
| `POST` | `/elections/:id/vote` | Vote in an election | Yes | `VoteDto`: `{ candidateUserIds: number[] }` |
| `POST` | `/admin/elections` | Create election | Admin | `CreateElectionDto`: `{ councilLevel, position?, reason, actorUserId? }` |
| `POST` | `/admin/elections/:id/candidates` | Add candidate | Admin | `AddCandidateDto`: `{ userId, reason, actorUserId }` |
| `POST` | `/admin/elections/:id/close` | Close election | Admin | `CloseElectionDto`: `{ reason, actorUserId }` |
| `POST` | `/admin/elections/apc` | Create APC elections | Admin | `CreateApcElectionsDto`: `{ vidhansabhaId, reason, actorUserId }` |
| `GET` | `/admin/elections/:id/results` | Get election results | Admin | - |

### Geo & Locations
| Method | Endpoint | Description | Auth | Body/Query |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/geo/loksabhas` | List Loksabhas | No | - |
| `GET` | `/geo/loksabhas/:id/vidhansabhas` | List Vidhansabhas in Loksabha | No | - |
| `GET` | `/geo/vidhansabhas/:id/local-units` | List Local Units in Vidhansabha | No | Query: `type` |
| `GET` | `/geo/qa` | Quality Assurance counts | No | - |
| `GET` | `/locations/districts` | List Districts | No | - |
| `GET` | `/locations/districts/:districtId/gps` | List GPs by District | No | - |
| `GET` | `/locations/gps` | List all GPs | No | - |
| `GET` | `/locations/gps/:gpId/wards` | List Wards by GP | No | - |
| `GET` | `/locations/loksabhas` | List Loksabhas | No | - |
| `GET` | `/locations/loksabhas/:id/vidhansabhas` | List Vidhansabhas | No | - |
| `GET` | `/locations/vidhansabhas/:id/local-units` | List Local Units | No | - |
| `GET` | `/locations/vidhansabhas/:id/wards` | List Wards in Local Units | No | - |

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
