import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-check',
  templateUrl: './check.component.html',
  styleUrls: ['./check.component.css']
})
export class CheckComponent implements OnInit {
  message: string | undefined;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const status = params['option'];
      if (status === 'pago') {
        this.message = '¡Una vez que el administrador apruebe el pago se te notificará su envío!';
      } else {
        if (status === 'publicacion'){
        this.message = '¡Pronto le enviaremos un correo de confirmación!';
        }
      }
    });
  }
}