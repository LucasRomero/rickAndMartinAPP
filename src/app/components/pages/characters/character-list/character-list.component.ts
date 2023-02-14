import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

import { DOCUMENT } from '@angular/common';
import { filter, take } from 'rxjs';

import { Character } from '@shared/interface/characters.interface';
import { CharacterService } from '@shared/services/character.service';

type RequestInfo = {
  next: string;
};

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit {
  characters: Character[] = [];
  info: RequestInfo = {
    next: ''
  };

  showGoUpButton = false;
  private pageNum = 1;
  private query = '';
  private hideScrollHeight = 200;
  private showScrollHeight = 500;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private characterService: CharacterService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.onUrlChanged();
  }
  ngOnInit(): void {
    // this.getDataFromService();
    this.getCharactersByQuery();
  }

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const yOffSet = window.scrollY;

    const scrollTop =
      this.document.documentElement.scrollTop || this.document.body.scrollTop;

    if ((yOffSet || scrollTop) > this.showScrollHeight) {
      this.showGoUpButton = true;
    } else if (
      this.showGoUpButton &&
      (yOffSet || scrollTop) < this.hideScrollHeight
    ) {
      this.showGoUpButton = false;
    }
  }

  onScrollDown() {
    if (this.info.next) {
      this.pageNum++;
      this.getDataFromService();
    }
  }

  onScrollTop() {
    this.document.body.scrollTop = 0; // Safari
    this.document.documentElement.scrollTop = 0; // Rest of browsers
  }

  private onUrlChanged(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.characters = [];
        this.pageNum = 1;
        this.getCharactersByQuery();
      });
  }

  private getCharactersByQuery(): void {
    // route
    this.route.queryParams.pipe(take(1)).subscribe((params) => {
      this.query = params['q'] || '';
      this.getDataFromService();
    });
  }

  private getDataFromService(): void {
    this.characterService
      .searchChyaracters(this.query, this.pageNum)
      .pipe(take(1))
      .subscribe((res: any) => {
        if (res?.results?.length) {
          const { info, results } = res;
          this.characters = [...this.characters, ...results];
          this.info = info;
        } else {
          this.characters = [];
        }
      });
  }
}
