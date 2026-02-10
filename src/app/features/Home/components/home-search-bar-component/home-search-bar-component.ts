import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { FeatureCardComponent } from '../../feature-card/feature-card-component/feature-card-component';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { SharedModule } from '../../../../shared/shared/shared-module';

@Component({
  selector: 'app-home-search-bar-component',
  imports: [SharedModule,Navbar],
  templateUrl: './home-search-bar-component.html',
  styleUrl: './home-search-bar-component.css',
})
export class HomeSearchBarComponent {
   popularSearches = [
    'Software Engineer',
    'Product Designer', 
    'Marketing Specialist'
  ];

  features = [
    {
      icon: 'travel_explore',
      title: 'Multi-source search',
      description: 'Aggregate listings from the web\'s top boards and find exclusive openings you won\'t see anywhere else.'
    },
    {
      icon: 'bookmark',
      title: 'Save favorites',
      description: 'Never lose track of a great opportunity. Bookmark roles and organize them into custom lists for later review.'
    },
    {
      icon: 'query_stats',
      title: 'Track applications',
      description: 'Monitor your status from application to offer. Get real-time updates on your progress and interview schedules.'
    },
    {
      icon: 'account_circle',
      title: 'Manage profile',
      description: 'Build a professional resume that stands out. Use our AI-powered tools to optimize your profile for ATS systems.'
    }
  ];

  companyLogos = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCsFQZ7HSmiX_k9XmNf_e5t9s4WFelUSY5AZo6mDFeKLW2hjxa4c0M11kVDTmTwD_6VnxPsp7bRQdegmTpiOvfGjACfNjdoCPeewBxEduoW_62CwmSzncWn1rGY39UHchWk4YN5z0SN3TMIUJ4w4r4OFfJpOeWvG0CoTm1ZuUg4SrzYxJB3inFoZbwdPzXRAa1lgJYDgS5HjMYotk1JKoSzXVTtL9MdBM3lLTGTq33LAOPz3hAVLVQKuIjCLjfJ6lQwdH615o8OLih7',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuD6lAcLTYbgGJ8m2ZdMKpguiGypC6sTXg9Vxlu9n0Or6t3s0GwvG9LNRJQQpPEEbcLEF7rP6nF8Z4e8pZBcprC5uftG-G_2TeoaHNxQSwDiruSs8tTZ9TFxR56K8FrpS8c0eT1loIW5ijUVrWoDfHPeDPSbT2E3AU9XzRGHIuDzd54ta1Swy32AcNYjWtHrDhX6OdOw3ie9E-3UJaQza1OX5Jl0KNB9h9xb9HpzzGoPGfj3JavnFgVO0mOz3J3zXlNNzKg9NIUFmu6K',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBJoEY19S6yWMMuyQCP3vhVLUV6lCfFojEYOwPQhPAjRGtIQ79cyNy_tQeSyGotxqj3_EvhGVlPn08JsOXkU4JmjD5YmjAeIQrfpOQdYFlZR3FUCaC8OG1o3M7ftC7ZtX8G5JvpUzSm8XCM0zCC95m60EuyHTZdGNYSIcmFRP4CwcqLyPxvdHjnJZRrxX_ArDI8IHMMGun81yLHUr9NQUWYYz49R2zIDiCwMr5FFB_Ad1Uy8dmEvrBA3w-QH6g4D0tAYsyYD-qxNw0h',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDuzmdWHAQ8R-fmuAMx8SoMBb5gW2aKIj_8-2df_48SkT9cs56re8UtKpTEyzkvQnYTc-nxQSoyr0Ys2fcCK3ofPXN_qSBNIIAU-zM9Gmi_fIIXfiZOiII86es0WD_LHJitn2P3yR7LqdhQpJdGruMUeJ7Zn1aB5uAa9FzaZzPhJYoU1xOaL3aVawNX4F5Kx7FrEp6nWJ49x5Lb4lk5FcjdZpu4Kqq5iUVluyoUcJjuamQCisnsJC8AqImy_FTQsclsH6oy6B5sZCM0',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBMw-ed6T0UiFnv0YK_D04lVWv8BA4Vt6RxwADs5KLhf2a7mlRLdPhMyDP2vgX06MUgFCxPiJKPzQz60EEkO0hpIeBqCJpoP3VPl_Zin01DkIWEYohAiRKbqXFsvzLkgw_FWPcOWzioiEYjydN2SmSWiECLAxTaolOHYqClGmsUWcEMg-2cH0nH1rkq54mhX7ix7l771tCd2CvM-iQHLNnlRtS_v8DpjG9gUHs6TNEmBBbgkNIWMEaqoJ3kz_q3rhFLBaipNEorfsRe'
  ];

  searchKeyword = '';
  searchLocation = '';

  constructor(private router: Router) {}

  onSearch(): void {
    console.log('Search initiated with keyword:', this.searchKeyword, 'and location:', this.searchLocation);
    // if (this.searchKeyword && this.searchLocation) {
    //   this.router.navigate(['/jobs/search'], {
    //     queryParams: {
    //       keyword: this.searchKeyword,
    //       location: this.searchLocation
    //     }
    //   });
    // }
  }

  navigateToJobs(): void {
    console.log('Navigating to job search page');
   // this.router.navigate(['/jobs/search']);
  }

  navigateToSignUp(): void {
    console.log('Navigating to sign-up page');
   // this.router.navigate(['/auth/register']);
  }

}
