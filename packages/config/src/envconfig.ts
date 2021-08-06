import dotenv from 'dotenv';

const allConf = {};

export function envConfig<TEnv, TCustom>(
    envConf: TEnv,
    customConf?: TCustom,
    dotEnvConf?: dotenv.DotenvConfigOptions,
): TEnv & TCustom & { NODE_ENV?: 'production' | 'development'; isDev: boolean; isProd: boolean } {
    dotenv.config(dotEnvConf);
    for (const name in envConf) {
        if (name in process.env) {
            let val: any = envConf[name];
            switch (typeof val) {
                case 'number':
                    const num = +(process.env[name] || NaN);
                    if (!isNaN(num)) val = num;
                    break;
                default:
                    val = process.env[name];
                    break;
            }
            envConf[name] = val as any;
        }
    }
    Object.assign(allConf, envConf);
    return Object.assign(envConf, customConf, {
        NODE_ENV: process.env.NODE_ENV,
        isDev: process.env.NODE_ENV !== 'production',
        isProd: process.env.NODE_ENV === 'production',
    }) as any;
}

export namespace envConfig {
    export function getAll() {
        return allConf;
    }
}
