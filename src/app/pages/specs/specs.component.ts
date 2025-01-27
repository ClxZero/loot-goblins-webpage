/* eslint-disable no-case-declarations */
import {
  Component,
  OnInit,
  Renderer2,
  Inject,
  PLATFORM_ID,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import {CommonModule, isPlatformBrowser} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {
  ColumnConfig,
  Player,
  PlayerSpec,
  SpecializationsDetails,
  User,
  TableData,
} from '../../models/specializations-table.interface';
import {forkJoin, map, Subscription, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, filter} from 'rxjs/operators';
import {DynamicTableComponent} from './dynamic-table/dynamic-table.component';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {Router, NavigationEnd} from '@angular/router';
import {CsvParserService} from '../../services/csv-parser.service';

export type TableConfig =
  | 'assignedSpecializations'
  | 'unassignedSpecializations'
  | 'allSpecializations'
  | 'userIdentities'
  | 'conciseAssignedSpecializations'
  | 'experts';

@Component({
  selector: 'specializations',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, NavbarComponent],
  templateUrl: './specs.component.html',
  styleUrl: './specs.component.scss',
})
export class SpecsComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  viewContainerRef!: ViewContainerRef;

  animateTable = false;
  selectedData: TableData | null = null;
  originalData: TableData | null = null; // New property to store original data
  currentConfig: TableConfig = 'assignedSpecializations';
  searchTerm = '';
  searchColumn = 'all'; // This line ensures 'all' is the default value
  searchSubject = new Subject<string>();

  // Change typeFilter to categoryFilter
  categoryFilter = 'all';
  categories: string[] = ['all'];

  player_spec: PlayerSpec[] = [];
  specs_detail: SpecializationsDetails[] = [];
  players: Player[] = [];
  users: User[] = [];

  backgrounds: string[] = [
    'assets/imgs/dedloc_bg.webp',
    'assets/imgs/turkoid_bg.webp',
    'assets/imgs/riot_bg.webp',
    'assets/imgs/vity_bg.webp',
  ];

  url_player_spec =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSMZRxAoKLNnXSIYK6Ijuv1e4o0XduVGIJPiA1qSWPF9ezMkOOpdJj1fTNbOTsUeLDoqv5oCG2y3RoR/pub?gid=119581432&single=true&output=csv';

  url_specs_detail =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSMZRxAoKLNnXSIYK6Ijuv1e4o0XduVGIJPiA1qSWPF9ezMkOOpdJj1fTNbOTsUeLDoqv5oCG2y3RoR/pub?gid=397146692&single=true&output=csv';

  url_players =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSMZRxAoKLNnXSIYK6Ijuv1e4o0XduVGIJPiA1qSWPF9ezMkOOpdJj1fTNbOTsUeLDoqv5oCG2y3RoR/pub?gid=142834345&single=true&output=csv';

  url_users =
    'https://docs.google.com/spreadsheets/d/e/2PACX-1vSMZRxAoKLNnXSIYK6Ijuv1e4o0XduVGIJPiA1qSWPF9ezMkOOpdJj1fTNbOTsUeLDoqv5oCG2y3RoR/pub?gid=0&single=true&output=csv';

  urls = [
    this.url_player_spec,
    this.url_specs_detail,
    this.url_players,
    this.url_users,
  ];

  // Add this new property
  expertAffectedCategories: string[] = [
    'Gear Workbench',
    'Lightning Impulse Regulator',
  ];

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private csvParser: CsvParserService
  ) {
    this.searchSubject
      .pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(() => {
        this.filterData();
      });

    this.subscriptions.add(
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          filter(event => (event as NavigationEnd).url.includes('/specs'))
        )
        .subscribe(() => {
          this.loadData();
        })
    );
  }

  private loadData(): void {
    const observables = this.urls.map((url, index) =>
      this.getCSV(url + `&nocache=${new Date().getTime()}`, index)
    );

    forkJoin(observables).subscribe({
      next: async results => {
        const parsedData = await Promise.all(results);

        // Add type assertions to each array
        this.player_spec = parsedData[0] as PlayerSpec[];
        this.specs_detail = parsedData[1] as SpecializationsDetails[];
        this.players = parsedData[2] as Player[];
        this.users = parsedData[3] as User[];

        this.originalData = this.combineDataWithSwitch(
          'assignedSpecializations'
        );
        this.selectedData = {...this.originalData};
        this.updateCategories();
        this.filterData();
      },
      error: err => {
        console.error('Error loading data:', err);
      },
      complete: () => {
        console.log('Vitaly rulz');
      },
    });
  }

  getCSV(url: string, index: number) {
    return this.http.get(url, {responseType: 'text'}).pipe(
      map((csvText: string) => {
        const parsedData = this.csvParser.parse(csvText);
        switch (index) {
          case 0:
            return parsedData as PlayerSpec[];
          case 1:
            return parsedData as SpecializationsDetails[];
          case 2:
            return parsedData as Player[];
          case 3:
            return parsedData as User[];
          default:
            return parsedData;
        }
      })
    );
  }

  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      this.setRandomBackground();
    }
    this.loadData();
  }

  changeParameters(config: TableConfig) {
    this.animateTable = true;
    this.currentConfig = config;
    this.originalData = this.combineDataWithSwitch(config);
    this.selectedData = {...this.originalData};
    // Remove this line to keep 'all' as the default
    // this.searchColumn = this.selectedData.columns[0].key;
    this.updateCategories();
    this.filterData();
  }

  combineDataWithSwitch(type: TableConfig): TableData {
    const userMap = new Map(this.users.map(user => [user.id, user]));
    const specializationMap = new Map(
      this.specs_detail
        .filter(spec => spec.active.toUpperCase() === 'TRUE') // Filter active specializations
        .map(spec => [spec.id, spec])
    );

    let rows: any[];
    let columns: ColumnConfig[];

    switch (type) {
      case 'assignedSpecializations':
        // Create a map to group users by specialization
        const specUserMap = new Map<string, string[]>();

        this.player_spec.forEach(spec => {
          const specialization = specializationMap.get(spec.specialization_id);
          if (specialization) {
            // Only process if the specialization is active
            const user = userMap.get(spec.user_id);
            if (user) {
              if (!specUserMap.has(spec.specialization_id)) {
                specUserMap.set(spec.specialization_id, []);
              }
              specUserMap.get(spec.specialization_id)!.push(user.display_name);
            }
          }
        });

        rows = Array.from(specUserMap.entries()).map(([specId, users]) => {
          const specialization = specializationMap.get(specId);
          return {
            display_name: users.join(', '),
            name: specialization?.name || 'Unknown',
            category: specialization?.category || 'Unknown',
            description: specialization?.description || 'No description',
            icon_url: specialization?.icon_url || '',
            user_count: users.length,
          };
        });

        columns = [
          {title: 'Players', key: 'display_name'},
          {title: 'Specialization', key: 'name'},
          {title: 'Category', key: 'category'},
          {title: 'Description', key: 'description'},
          {title: 'Icon', key: 'icon_url'},
          {title: 'User Count', key: 'user_count'},
        ];
        break;

      case 'conciseAssignedSpecializations':
        const specUserMap2 = new Map<string, string[]>();

        this.player_spec.forEach(spec => {
          const user = userMap.get(spec.user_id);
          if (user) {
            if (!specUserMap2.has(spec.specialization_id)) {
              specUserMap2.set(spec.specialization_id, []);
            }
            specUserMap2.get(spec.specialization_id)!.push(user.display_name);
          }
        });

        rows = Array.from(specUserMap2.entries()).map(([specId, users]) => {
          const specialization = specializationMap.get(specId);
          return {
            display_name: users.join(', '),
            name: specialization?.name || 'Unknown',
            category: specialization?.category || 'Unknown', // Added category
            icon_url: specialization?.icon_url || '',
            user_count: users.length,
          };
        });

        columns = [
          {title: 'Players', key: 'display_name'},
          {title: 'Specialization', key: 'name'},
          {title: 'Category', key: 'category'}, // Added category column
          {title: 'Icon', key: 'icon_url'},
          {title: 'User Count', key: 'user_count'},
        ];
        break;

      case 'unassignedSpecializations':
        const assignedSpecIds = new Set(
          this.player_spec.map(spec => spec.specialization_id)
        );
        rows = Array.from(specializationMap.values())
          .filter(spec => !assignedSpecIds.has(spec.id))
          .map(spec => ({
            ...spec,
            display_name: 'No one has this specialization yet',
            levels: spec.levels || 'N/A',
          }));

        columns = [
          {title: 'Status', key: 'display_name'},
          {title: 'Specialization', key: 'name'},
          {title: 'Found on lvl', key: 'levels'},
          {title: 'Category', key: 'category'},
          {title: 'Description', key: 'description'},
          {title: 'Icon', key: 'icon_url'},
        ];
        break;

      case 'allSpecializations':
        rows = Array.from(specializationMap.values()).map(spec => ({
          ...spec,
          levels: spec.levels || 'N/A',
        }));

        columns = [
          {title: 'Specialization', key: 'name'},
          {title: 'Found on lvl', key: 'levels'},
          {title: 'Type', key: 'type'},
          {title: 'Category', key: 'category'},
          {title: 'Identity', key: 'identity'},
          {title: 'Description', key: 'description'},
          {title: 'Icon', key: 'icon_url'},
        ];
        break;

      case 'userIdentities':
        const userIdentities = this.calculateUserIdentities();
        rows = userIdentities.map(user => ({
          display_name: user.display_name,
          identity: user.identity,
          specializations: user.specializations.join(', '),
        }));

        columns = [
          {title: 'User', key: 'display_name'},
          {title: 'Identity', key: 'identity'},
          {title: 'Specializations', key: 'specializations'},
        ];
        break;

      case 'experts':
        const expertUsers = new Map<string, Map<string, string[]>>();
        const affectedTotals = new Map<string, number>();

        // Count total specializations for each affected category
        Array.from(specializationMap.values()).forEach(spec => {
          affectedTotals.set(
            spec.affected,
            (affectedTotals.get(spec.affected) || 0) + 1
          );
        });

        this.player_spec.forEach(spec => {
          const specialization = specializationMap.get(spec.specialization_id);
          if (specialization) {
            const user = userMap.get(spec.user_id);
            if (user) {
              if (!expertUsers.has(user.id)) {
                expertUsers.set(user.id, new Map());
              }
              const userAffected = expertUsers.get(user.id)!;
              if (!userAffected.has(specialization.affected)) {
                userAffected.set(specialization.affected, []);
              }
              userAffected
                .get(specialization.affected)!
                .push(specialization.name);
            }
          }
        });

        rows = [];
        expertUsers.forEach((affectedMap, userId) => {
          affectedMap.forEach((specializations, affected) => {
            const isExpertCategory =
              this.expertAffectedCategories.includes(affected);
            if (isExpertCategory || specializations.length >= 2) {
              const user = userMap.get(userId)!;
              const totalForAffected = affectedTotals.get(affected) || 0;
              rows.push({
                display_name: user.display_name,
                affected: affected,
                specializations: specializations.join(', '),
                total: `${specializations.length}/${totalForAffected}`,
                isComplete:
                  isExpertCategory ||
                  specializations.length === totalForAffected,
              });
            }
          });
        });

        columns = [
          {title: 'Godlike-being', key: 'display_name'},
          {title: 'Expertise', key: 'affected'},
          {title: 'Specializations', key: 'specializations'},
          {title: 'Total', key: 'total'},
        ];
        break;

      default:
        rows = [];
        columns = [];
    }

    return {
      columns,
      rows,
    };
  }

  calculateUserIdentities() {
    const userIdentities = this.users.map(user => {
      const userSpecs = this.player_spec.filter(
        spec => spec.user_id === user.id
      );
      const identityCounts: {[key: string]: number} = {};
      const userSpecializations: string[] = [];

      userSpecs.forEach(spec => {
        const specialization = this.specs_detail.find(
          s => s.id === spec.specialization_id
        );
        if (specialization) {
          identityCounts[specialization.identity] =
            (identityCounts[specialization.identity] || 0) + 1;
          userSpecializations.push(specialization.name);
        }
      });

      const dominantIdentity = Object.entries(identityCounts).reduce(
        (a, b) => (a[1] > b[1] ? a : b),
        ['', 0]
      )[0];

      return {
        display_name: user.display_name,
        identity: dominantIdentity || 'Undefined',
        specializations: userSpecializations,
      };
    });

    return userIdentities;
  }

  onSearch(term?: any) {
    if (!term) return;
    this.searchTerm = term.target.value;
    this.filterData(); // Trigger search immediately
  }

  filterData() {
    if (!this.originalData || !this.selectedData) return;

    const filteredRows = this.originalData.rows.filter(row => {
      let matchesSearch = true;
      let matchesCategory = true;

      if (this.searchTerm) {
        if (this.searchColumn === 'all') {
          // Search in all columns
          matchesSearch = Object.values(row).some(value =>
            String(value).toLowerCase().includes(this.searchTerm.toLowerCase())
          );
        } else {
          // Search in specific column
          matchesSearch = String(row[this.searchColumn])
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase());
        }
      }

      if (this.categoryFilter !== 'all') {
        if (this.currentConfig === 'userIdentities') {
          matchesCategory = row.identity === this.categoryFilter;
        } else {
          matchesCategory = row.category === this.categoryFilter;
        }
      }

      return matchesSearch && matchesCategory;
    });

    // Sort rows by user count in descending order for 'assignedSpecializations'
    if (this.currentConfig === 'assignedSpecializations') {
      filteredRows.sort((a, b) => b.user_count - a.user_count);
    }

    this.selectedData = {
      ...this.originalData,
      rows: filteredRows,
    };
  }

  loadDynamicTable() {
    return DynamicTableComponent;
  }

  combineData(
    users: User[],
    players: Player[],
    specializations: SpecializationsDetails[],
    playerSpecs: PlayerSpec[]
  ) {
    // Crear un mapa para relacionar ids de usuarios con sus datos
    const userMap = new Map(users.map(user => [user.id, user]));

    // Crear un mapa para relacionar ids de especializaciones con sus datos
    const specializationMap = new Map(
      specializations.map(spec => [spec.id, spec])
    );

    // Construir las filas combinadas
    const rows = playerSpecs.map(spec => {
      const user = userMap.get(spec.user_id);
      const player = players.find(p => p.user_id === spec.user_id);
      const specialization = specializationMap.get(spec.specialization_id);

      return {
        ...user,
        ...player,
        ...specialization,
        specialization_level: spec.level || 'N/A',
      };
    });
    console.log(users);

    // Obtener las columnas dinámicamente de las interfaces
    const userColumns =
      users.length > 0 ? Object.keys(users[0]).filter(key => key !== 'id') : [];
    const playerColumns =
      players.length > 0
        ? Object.keys(players[0]).filter(key => key !== 'user_id')
        : [];
    const specializationColumns =
      specializations.length > 0
        ? Object.keys(specializations[0]).filter(key => key !== 'id')
        : [];

    // Agregar columnas adicionales específicas de la combinación
    const additionalColumns = ['specialization_level'];

    // Combinar todas las columnas
    const columns = [
      ...userColumns,
      ...playerColumns,
      ...specializationColumns,
      ...additionalColumns,
    ];
    console.log(columns);

    return {
      columns,
      rows,
    };
  }

  setRandomBackground(): void {
    const randomBackground =
      this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];

    const mainContainerElement = document.querySelector('.main-container');

    if (mainContainerElement) {
      this.renderer.setStyle(
        mainContainerElement,
        'background-image',
        `url(${randomBackground})`
      );
      this.renderer.setStyle(
        mainContainerElement,
        'background-position',
        'center'
      );
      this.renderer.setStyle(mainContainerElement, 'background-size', 'cover');
      this.renderer.setStyle(mainContainerElement, 'position', 'relative');
      this.renderer.setStyle(mainContainerElement, 'z-index', '1');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();

    if (isPlatformBrowser(this.platformId)) {
      const mainContainerElement = document.querySelector('.main-container');
      if (mainContainerElement) {
        this.renderer.removeClass(mainContainerElement, 'specs-bg');
        this.backgrounds.forEach(bg => {
          this.renderer.removeClass(mainContainerElement, bg);
        });
      }
    }
  }

  // Change updateTypes to updateCategories
  updateCategories() {
    if (this.originalData) {
      let categoryKey: string;
      switch (this.currentConfig) {
        case 'userIdentities':
          categoryKey = 'identity';
          break;
        default:
          categoryKey = 'category';
      }
      const uniqueCategories = new Set(
        this.originalData.rows.map(row => row[categoryKey])
      );
      this.categories = ['all', ...Array.from(uniqueCategories)];
    }
  }

  // Change onTypeFilterChange to onCategoryFilterChange
  onCategoryFilterChange() {
    this.filterData();
  }
}
