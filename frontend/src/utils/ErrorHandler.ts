export class ErrorHandler {
    static handleError(error: any): string {
        if (error instanceof Error) {
            return error.message;
        }
        if (typeof error === 'string') {
            return error;
        }
        return 'Une erreur inattendue est survenue';
    }

    static displayError(error: any): void {
        const message = this.handleError(error);
        console.error('Error:', message);
    }
}