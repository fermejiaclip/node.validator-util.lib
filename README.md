# node.reconciliation-dd-common-lib

node.reconciliation-dd-common-lib owned by team-skunkworks

## Installation

```
npm install @clipmx/reconciliation-dd-common-lib
```

## Configuration

Commonly the templates have the default Transform clause like this:
```yaml
Transform: AWS::Serverless-2016-10-31
```
We need to change to start using the the datadog layer extention in our projects:
```yaml
Transform:
  - AWS::Serverless-2016-10-31
  - Name: DatadogServerless
    Parameters:
      stackName: !Ref 'AWS::StackName'
      apiKey: [DD_API_KEY]
      nodeLayerVersion: 60
      extensionLayerVersion: 9
```
Add some global tags to all your lambdas, all the tags are going to be added to all its DD metrics
```yaml
Globals:
  Function:
    Tags:
      team: skunkworks
      service: my_service
Then, for each lambda declaration with to add some env vars are going to be used by datadog to a some metadata to each metric.
```

```yaml
MyAwesomeLambda:
    Type: AWS::Serverless::Function
    Properties:
      Tags:
        component: my_awesome_lambda
```

**env** is the only tag required. And it is used to separed the metrics across the different environment, *if you dont set it, all dev, stage and prod metrics with the same name are going to be mixed!*

For **service** we strongly recomend to use the name of the repo were the lives. It is pretty relevant when a project have several metrics.

**DD_TAGS**: Could be any key:pair value that could be relevant for the metric and separated by commas, e.g:component:MyAwesomeLambda,mood:awesome,color:red.
But is strongly recommended to at least declare "component" with name of the lambda.




## Usage

Refer to the [Wiki](https://github.com/ClipMX/node.reconciliation-dd-common-lib/wiki) for usage examples

## Technologies Used

- [TypeScript](https://www.typescriptlang.org/docs/home.html)
- [Jest](https://facebook.github.io/jest/) for testing
- [TypeDoc](http://typedoc.org/) for auto-generated documentation

## Contributing

Shared implementation to use datadog reconciliation metrics for lambda

```
git clone git@github.com:ClipMX/node.reconciliation-dd-common-lib
```

**Build Tests**

```
npm run test:watch
```

**Add Usage Examples**

TypeDoc will generate API documentation based on the TypeScript types used in the code. TypeDoc will also
pull any doc strings into the generated code, which is useful for providing a little more description and
usage examples to each `Module`, `Class`, `Variable`, `Function`, etc. The doc string should be written in
MarkDown to take advantage of syntax highlighted code blocks.

## TypeScript Resources

- [TypeScript Deep Dive](https://basarat.gitbooks.io/typescript/content/docs/getting-started.html)
- [TypeScript Docs](https://www.typescriptlang.org/docs/home.html)

## Publishing

Merge feature branch to master and jenkins pipeline should do the rest
# node.validator-util.lib
