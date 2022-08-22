import { Module } from '@nestjs/common';
import { ParseMongoIdPipe } from './pipes/parse-mongo-id.pipe';

@Module({
    imports: [],
    providers: [ParseMongoIdPipe],
    exports: [ParseMongoIdPipe]
})
export class CommonModule {}
