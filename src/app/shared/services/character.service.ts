import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Character } from '@shared/interface/characters.interface';
import { enviroment } from 'enviroment';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  constructor(private http: HttpClient) {}

  searchChyaracters(query = '', page = 1) {
    return this.http.get<Character[]>(
      `${enviroment.baseUrlApi}/name?${query}&page=${page}`
    );
  }

  getDetails(id: number) {
    return this.http.get<Character>(`${enviroment.baseUrlApi}/${id}`);
  }
}
