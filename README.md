# Noct

> This project is work in progress. Do _NOT_ use this library for production
> applications until fully released.

A fully compliant Discord API library written in TypeScript for the Deno
JavaScript runtime.

## Features

Noct comes equiped with numerous features to help you develop your Discord
applications.

- Asynchronous design for parallel execution and proper error handling
- Metrics and monitoring tools for managing the state of your application
- An advanced shard manager for orchestrating heavy duty applications
- A decorator-based command system for easily setting up responsive bots
- ... many more to come!

## Setup

> It is _HIGHLY_ recommended to use a static version of the library instead of
> always pulling the latest version. This ensures no breaking changes interfere
> with the lifetime of your application.

Using Noct in your application is very easy. All you have to do is simply import
the following link as a dependency:

```ts
import { Client } from "https://deno.land/x/noct@v1.0.0";
```

## Examples

If you want to get started, you can refer to the examples provided in the
`examples/` folder to familiarize yourself with the library. Documentation is
also provided to explain ins and outs of the different classes, methods, enums,
and properties.

## Start

After you have prepared your application, ensure to include the `--allow-net`
flag in the command line. If you decide to use decorators to use the command
system, ensure to include the `--unstable` flag.

```sh
deno run --allow-net --unstable bot.ts
```
