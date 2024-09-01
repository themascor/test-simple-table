export interface Toast {
    type: ToastType,
    message: string;
    _id?: number;
}

export enum ToastType {
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS'
}