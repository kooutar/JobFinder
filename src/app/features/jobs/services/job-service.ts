import { Injectable } from '@angular/core';
import { API_URL } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponse } from '../interfaces/paginated-response.model';
import { Job } from '../interfaces/job.model';

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl= API_URL;

  constructor(private http: HttpClient){}

  getAllJobs(page = 1) {
    return this.http.get<PaginatedResponse<Job>>(`${this.apiUrl}?page=${page}`);
  }

  getJobById(id: number) {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }
}
