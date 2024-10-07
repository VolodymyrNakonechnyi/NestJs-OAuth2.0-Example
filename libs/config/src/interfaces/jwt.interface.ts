export interface ISingleJwt {
    secret: string,
    time: string
}

export interface IAccessJwt {
    publicKey: string,
    privateKey: string,
    time: string
};

export interface IJwt {
    access: IAccessJwt,
    refresh: ISingleJwt,
    resetPassword: ISingleJwt,
    confirmation: ISingleJwt
};
