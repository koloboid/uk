import cli from "../src";

export class CmdPush {
    origin = cli.String("Some docs", ["o", "O"]);
    back = cli.Command(
        class {
            revert = cli.Bool();
        },
    );
}

export class CmdBuilder {
    prune = cli.Command(CmdBuilder.CmdPrune).doc("Remove build cache");
    build = cli.Command(CmdBuilder.CmdBuild).doc("Build an image from a Dockerfile");
}
export namespace CmdBuilder {
    export class CmdBuild {
        addHost = cli.Array(cli.String()).doc("Add a custom host-to-IP mapping (host:ip)");
    }
    export class CmdPrune {
        all = cli.Bool("Remove all unused build cache, not just dangling ones", "a");
        filter = cli.String("Provide filter values (e.g. 'until=24h')");
        force = cli.Bool("Do not prompt for confirmation", "f");
        keepStorage = cli.Int("Amount of disk space to keep for cache", ["keep-storage"]);
    }
}
cli.handle(CmdBuilder.CmdBuild, (config) => {
    config.addHost.length;
});

export class Config {
    debug = cli.Bool().alias("D").doc("Enable debug mode");
    host = cli.Array(cli.String()).alias("H").doc("Daemon socket(s) to connect to");
    tls = cli.Bool("Use TLS; implied by --tlsverify");
    tlscacert = cli.String('Trust certs signed only by this CA (default "~/.docker/ca.pem")');
    tlscert = cli.String('Path to TLS certificate file (default "~/.docker/cert.pem")');
    tlskey = cli.String('Path to TLS key file (default "~/.docker/key.pem")');
    tlsverify = cli.String("Use TLS and verify the remote");
    context = cli.String("Name of the context to use to connect to the daemon", "-c");
    version = cli.Bool("Print version information and quit", "-v");
    logLevel = cli
        .Enum("debug", "info", "warn", "error", "fatal")
        .alias("l")
        .default("info")
        .doc('Set the logging level ("debug"|"info"|"warn"|"error"|"fatal") (default "info")');

    push = cli.Command(CmdPush).doc("Some doc");
    builder = cli.Command(CmdBuilder).doc("Manage builds");
}

export const config = cli.execute(Config);

cli.handle(Config, "version", () => {
    console.log("Version");
    process.exit(0);
});

/*

const cmdBuilder = cli.commands({
    builder: {
        doc: "Manage builds",
        commands: {
            prune: {
                doc: "Remove build cache",
                options: {
                    all: {
                        alias: "a",
                        doc: "Remove all unused build cache, not just dangling ones",
                    },
                    filter: {
                        doc: "Provide filter values (e.g. 'until=24h')",
                        type: String,
                    },
                    force: {
                        alias: "f",
                        doc: "Do not prompt for confirmation",
                    },
                    "keep-storage": {
                        doc: "Amount of disk space to keep for cache",
                        type: Number,
                    },
                },
            },
            build: {
                doc: "Build an image from a Dockerfile",
                options: {
                    "--add-host": {
                        doc: "Add a custom host-to-IP mapping (host:ip)",
                        type: String,
                    },
                },
            },
        },
    },
});

const config = cli
    .options({
        config: "~/.docker",
        debug: {
            alias: "D",
            doc: "Enable debug mode",
        },
        host: {
            alias: "H",
            type: Array,
            doc: "Daemon socket(s) to connect to",
        },
        "log-level": {
            alias: "l",
            type: String,
            doc: 'Set the logging level ("debug"|"info"|"warn"|"error"|"fatal") (default "info")',
            default: "info",
        },
        tls: {
            doc: "Use TLS; implied by --tlsverify",
        },
        tlscacert: {
            doc: 'Trust certs signed only by this CA (default "~/.docker/ca.pem")',
            type: String,
        },
        tlscert: {
            doc: 'Path to TLS certificate file (default "~/.docker/cert.pem")',
            type: String,
        },
        tlskey: {
            doc: 'Path to TLS key file (default "~/.docker/key.pem")',
            type: String,
        },
        tlsverify: {
            doc: "Use TLS and verify the remote",
            type: String,
        },
        context: {
            alias: "c",
            doc: "Name of the context to use to connect to the daemon",
        },
        version: {
            alias: ["v"],
            doc: "Print version information and quit",
        },
    })
    .env({
        MONGODB: "mongodb://127.0.0.1",
        FOO: {
            type: (v) => Number(v),
            default: "",
        },
    })
    .commands({
        push: {
            handle: () => {},
            doc: "Some doc",
            options: {
                origin: {
                    type: String,
                    doc: "Some docs",
                    alias: "o",
                    handle: () => 0,
                },
            },
            commands: {
                back: {
                    options: {
                        "--revert": "",
                    },
                },
            },
        },
    })
    .commands(cmdBuilder)
    .build();
    */
