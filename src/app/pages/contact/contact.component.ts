import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {

  name: string = '';
  email: string = '';
  subject: string = '';
  message: string = '';

  constructor(private toastr: ToastrService) {}

  sendMessage() {
    if (!this.name || !this.email || !this.subject || !this.message) {
      this.toastr.error('Validacion', 'Todos los campos son obligatorios');
      return;
    }
    this.toastr.success('Exito', 'Mensaje enviado correctamente');
    this.name = '';
    this.email = '';
    this.subject = '';
    this.message = '';
  }
}
