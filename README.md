three.ts
---

A Typescript 'Hello World' example project that utilizes Three.js and jQuery through DefinitelyTyped typings.

[![Screenshot](http://three-ts.selby.io/screenshot.png)](http://three-ts.selby.io)

## Requirements

- [Node.js](https://nodejs.org/en/download/package-manager/)
- [Gulp](http://gulpjs.com/)
  - `npm install --global gulp-cli`
- [TSD](http://definitelytyped.org/) (to manage Typings)
  - `npm i -g tsd@next `

## Usage

### Setup

```bash
git clone git@github.com:selbyk/three.ts.git
cd ./three.ts
npm i
```

### Start Auto-Refresh Build Process & Server

```bash
gulp
```

Local server is accessible at [http://localhost:8000](http://localhost:8000)

### Publish to AWS S3

```bash
gulp publish
```

## Attribution

- [Quick Start Guide - How to build TypeScript](https://www.typescriptlang.org/docs/handbook/gulp.html)
- [Creating a TypeScript Workflow with Gulp](http://weblogs.asp.net/dwahlin/creating-a-typescript-workflow-with-gulp)
- [TypeScript + Gulp + Bower + Browserify](http://www.davidkudera.com/2015/02/28/typescript-gulp-bower-browserify/)
- [Create a rotating cube in WebGL with Three.js](http://www.jonathan-petitcolas.com/2013/04/02/create-rotating-cube-in-webgl-with-threejs.html)
- [Basic to Advanced Three.js Techniques](https://stemkoski.github.io/Three.js/)
