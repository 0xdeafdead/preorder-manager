import { Injectable, Logger } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import { CreatePreorderInput } from './input/create-preorder.input';
import { UpdatePreorderInput } from './input/update-preorder.input';
import { PreorderRepository } from './repositories/preorder.repository';
import { Preorder } from './schemas/preorder.schema';

@Injectable()
export class PreorderService {
  logger: Logger;
  constructor(private readonly preorderRepository: PreorderRepository) {
    this.logger = new Logger(PreorderService.name);
  }

  create(createPreorderInput: CreatePreorderInput): Observable<Preorder> {
    return from(this.preorderRepository.create(createPreorderInput));
  }

  findAll() {
    return from(this.preorderRepository.findAll());
  }

  findOne(id: string) {
    return from(this.preorderRepository.findById(id));
  }

  update(updatePreorderInput: UpdatePreorderInput) {
    return from(this.preorderRepository.update(updatePreorderInput));
  }

  softDelete(id: string) {
    return from(this.preorderRepository.softDelete(id));
  }

  remove(id: string) {
    return from(this.preorderRepository.delete(id));
  }
}
