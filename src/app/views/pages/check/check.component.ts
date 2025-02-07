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
    //queryparams para leer los parámetros de la URL
    this.route.queryParams.subscribe(params => {
      // toma la parte de option y lo compara
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