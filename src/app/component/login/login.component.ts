import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Users } from '../../model/users';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  host: { ngSkipHydration: 'true' },
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  ngOnInit(): void {
    for (let i = 0; i < this.usersAll.length; i++) {
      const id = this.usersAll[i].id;
      this.idUser.push(id);
    }
  }


  user: Users = {
    id: "",
    pseudo: "",
    email: "",
    password: "",
    type: ""
  };

  idUser: any[] = [];

  usersAll: Users[] = [];

  donneeUser: any[] = [];

  constructor(private http: HttpClient, private router: Router) {
    this.getAllUsers();
  }



  getAllUsers(): void {
    this.http.get('http://localhost:8080/listUser').subscribe((data: any) => {
      this.usersAll = data;
    });
  }

  connexion(): void {
    this.router.navigateByUrl("/layout/livre");
  }

}
