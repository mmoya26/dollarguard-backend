<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

# Things to do
- Research cookie warning message (Cookie will soon be rejected because it is foreign and does not have the “Partitioned“ attribute.)
- Look into moving validations of params to their on validator constraint
- Use NestJS HttpExceptions enums instead of using hard coded status codes
- Move validation from NestJS controller to services instead
- Update auth.guard.ts in server to check if the token has not expired because we are only checking if the token is present or not
- Possibly add verification when deleting a category from user preferences to see if the passed ids actually exists (currently it just doesn't do anything returns the collection)