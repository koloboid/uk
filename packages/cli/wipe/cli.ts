type Config<T> = {
    [P in keyof T]: T[P];
};

export class Cli<TOpts extends object, TCmds extends object, TEnv extends object> {
    env<TEnv extends EnvVars>(variables: TEnv): Cli<TOpts, TCmds, TEnv> {
        return this as any;
    }

    help(help: string) {
        return this;
    }

    options<T extends Options>(opts: T): Cli<TOpts & T, TCmds, TEnv> {
        return this as any;
    }

    commands<T extends Commands>(cmds: T): Cli<TOpts, TCmds & T, TEnv>;
    commands<T extends object>(cli: Cli<any, T, any>): Cli<TOpts, TCmds & T, TEnv>;
    commands(cmds: object): any {
        return this as any;
    }

    build(): Config<TOpts & TCmds & TEnv> {
        throw new Error("Not implemented yet");
    }

    #help = "";
    #options = {};
    #commands = {};
}

type Commands = { [cmd: string]: Command };

type Options = { [optName: string]: Option };

type EnvVars = { [varName: string]: EnvVar<any> };

type Types<T> = (values: string[]) => T;

type EnvVar<T> =
    | string
    | {
          type?: Types<T>;
          default?: T;
          doc?: string;
          alias?: string | string[];
      };

type Option =
    | string
    | {
          type?: Types<any>;
          typeName?: string;
          default?: any;
          doc?: string;
          alias?: string | string[];
          env?: string | string[];
          handle?: Function;
      };

type Command = {
    handle?: () => any;
    doc?: string;
    options?: Options;
    commands?: Commands;
};
