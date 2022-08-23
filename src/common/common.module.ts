import { Module } from '@nestjs/common';
import { ParseMongoIdPipe } from './pipes/parse-mongo-id.pipe';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
    imports: [],
    providers: [ParseMongoIdPipe, AxiosAdapter],
    exports: [ParseMongoIdPipe, AxiosAdapter]
})
export class CommonModule {}
