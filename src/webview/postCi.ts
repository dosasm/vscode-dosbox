import { CommandInterface } from 'emulators';

export class PostCi {
    constructor(
        private post: (msg: any) => void
    ) {

    }
    setCi(ci: CommandInterface) {
        ci.events().onStdout(value => this.post({
            command: "stdout",
            value
        }));
    }
}