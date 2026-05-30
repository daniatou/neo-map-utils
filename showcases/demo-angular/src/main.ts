import { bootstrapApplication } from '@angular/platform-browser';
import { DemoAppComponent } from './app/app.component';

bootstrapApplication(DemoAppComponent).catch((error: unknown) => {
  console.error(error);
});
