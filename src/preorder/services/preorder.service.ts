import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { from, Observable, of, switchMap } from 'rxjs';
import {
  CreatePreorderInput,
  ListPreordersInput,
  UpdatePreorderInput,
} from '../input';
import { PreorderRepository } from '../repositories/preorder.repository';
import { Preorder } from '../schemas/preorder.schema';
import { PaginatedPreorders } from '../types';

@Injectable()
export class PreorderService {
  logger: Logger;
  constructor(private readonly preorderRepository: PreorderRepository) {
    this.logger = new Logger(PreorderService.name);
  }

  create(createPreorderInput: CreatePreorderInput): Observable<Preorder> {
    return from(this.preorderRepository.create(createPreorderInput));
  }

  findAll(): Observable<Preorder[]> {
    return from(this.preorderRepository.findAll());
  }

  list(listPreordersInput: ListPreordersInput): Observable<PaginatedPreorders> {
    return from(this.preorderRepository.listPreorders(listPreordersInput));
  }

  findOne(id: string): Observable<Preorder> {
    return from(this.preorderRepository.findById(id)).pipe(
      switchMap((preorder) => {
        if (!preorder) {
          throw new NotFoundException('Preorder not found');
        }
        return of(preorder);
      }),
    );
  }

  update(updatePreorderInput: UpdatePreorderInput): Observable<Preorder> {
    const { id, ...data } = updatePreorderInput;
    return from(this.preorderRepository.update(id, data)).pipe(
      switchMap((preorder) => {
        if (!preorder) {
          throw new NotFoundException('Preorder not found');
        }
        return of(preorder);
      }),
    );
  }

  changeAvailability(id: string): Observable<Preorder> {
    return from(this.preorderRepository.changeAvailability(id)).pipe(
      switchMap((preorder) => {
        if (!preorder) {
          throw new NotFoundException('Preorder not found');
        }
        return of(preorder);
      }),
    );
  }

  softDelete(id: string): Observable<Preorder> {
    return from(
      this.preorderRepository.update(id, {
        deletedAt: new Date(),
      }),
    ).pipe(
      switchMap((preorder) => {
        if (!preorder) {
          throw new NotFoundException('Preorder not found');
        }
        return of(preorder);
      }),
    );
  }

  remove(id: string): Observable<Preorder> {
    return from(this.preorderRepository.delete(id)).pipe(
      switchMap((preorder) => {
        if (!preorder) {
          throw new NotFoundException('Preorder not found');
        }
        return of(preorder);
      }),
    );
  }
}
