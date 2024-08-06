import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/**
 * @title Basic icons
 */
@Component({
  selector: 'app-search-icon',
  templateUrl: './search-icon.component.html',
  standalone: true,
  imports: [MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchIconComponent { }
