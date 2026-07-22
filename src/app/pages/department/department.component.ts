import { Component, afterNextRender } from '@angular/core';
import { HomeService } from '../home/service/home.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CartService } from '../home/service/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ModalProductComponent } from '../guest-view/component/modal-product/modal-product.component';

declare var $: any;
@Component({
  selector: 'app-department',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule, ModalProductComponent],
  templateUrl: './department.component.html',
  styleUrl: './department.component.css'
})
export class DepartmentComponent {

  department: any = null;
  categories: any = [];
  PRODUCTS: any = [];
  currency: string = 'PEN';
  slug: string = '';

  product_selected: any = null;
  variation_selected: any = null;

  constructor(
    public homeService: HomeService,
    public cookieService: CookieService,
    public cartService: CartService,
    public toastr: ToastrService,
    public router: Router,
    public activedRoute: ActivatedRoute,
  ) {
    this.activedRoute.params.subscribe((params: any) => {
      this.slug = params.slug;
      this.loadDepartment();
    });
  }

  ngOnInit(): void {
    this.currency = this.cookieService.get("currency") ? this.cookieService.get("currency") : 'PEN';
  }

  loadDepartment() {
    this.homeService.menus().subscribe((resp: any) => {
      let departments = resp.categories_menus;
      this.department = departments.find((d: any) => d.id == this.slug);

      if (this.department) {
        this.categories = this.department.categories || [];
        this.loadProducts();
      }
    });
  }

  loadProducts() {
    this.homeService.filterAdvanceProduct({
      categories_selected: [this.department.id],
      currency: this.currency,
    }).subscribe((resp: any) => {
      this.PRODUCTS = resp.products.data;
    });
  }

  getTotalCurrency(PRODUCT: any) {
    if (this.currency == 'PEN') {
      return PRODUCT.price_pen;
    } else {
      return PRODUCT.price_usd;
    }
  }

  getNewTotal(PRODUCT: any, DISCOUNT_FLASH_P: any) {
    if (this.currency == 'PEN') {
      if (DISCOUNT_FLASH_P.type_discount == 1) {
        return (PRODUCT.price_pen - PRODUCT.price_pen * (DISCOUNT_FLASH_P.discount * 0.01)).toFixed(2)
      } else {
        return (PRODUCT.price_pen - DISCOUNT_FLASH_P.discount).toFixed(2);
      }
    } else {
      if (DISCOUNT_FLASH_P.type_discount == 1) {
        return (PRODUCT.price_usd - PRODUCT.price_usd * (DISCOUNT_FLASH_P.discount * 0.01)).toFixed(2)
      } else {
        return (PRODUCT.price_usd - DISCOUNT_FLASH_P.discount).toFixed(2);
      }
    }
  }

  getTotalPriceProduct(PRODUCT: any) {
    if (PRODUCT.discount_g) {
      return this.getNewTotal(PRODUCT, PRODUCT.discount_g);
    }
    if (this.currency == 'PEN') {
      return PRODUCT.price_pen;
    } else {
      return PRODUCT.price_usd;
    }
  }

  addCart(PRODUCT: any) {
    if (!this.cartService.authService.user) {
      this.toastr.error("Validacion", "Ingrese a la tienda");
      this.router.navigateByUrl("/login");
      return;
    }

    if (PRODUCT.variations.length > 0) {
      $("#producQuickViewModal").modal("show");
      this.openDetailProduct(PRODUCT);
      return;
    }

    let discount_g = null;
    if (PRODUCT.discount_g) {
      discount_g = PRODUCT.discount_g;
    }

    let data = {
      product_id: PRODUCT.id,
      type_discount: discount_g ? discount_g.type_discount : null,
      discount: discount_g ? discount_g.discount : null,
      type_campaing: discount_g ? discount_g.type_campaing : null,
      code_cupon: null,
      code_discount: discount_g ? discount_g.code : null,
      product_variation_id: null,
      quantity: 1,
      price_unit: this.currency == 'PEN' ? PRODUCT.price_pen : PRODUCT.price_usd,
      subtotal: this.getTotalPriceProduct(PRODUCT),
      total: this.getTotalPriceProduct(PRODUCT) * 1,
      currency: this.currency,
    }

    this.cartService.registerCart(data).subscribe((resp: any) => {
      if (resp.message == 403) {
        this.toastr.error("Validacion", resp.message_text);
      } else {
        this.cartService.changeCart(resp.cart);
        this.toastr.success("Exito", "El producto se agrego al carrito de compra");
      }
    }, err => {
      console.log(err);
    })
  }

  addCompareProduct(TRADING_PRODUCT: any) {
    let COMPARES = localStorage.getItem("compares") ? JSON.parse(localStorage.getItem("compares") ?? '') : [];
    let INDEX = COMPARES.findIndex((item: any) => item.id == TRADING_PRODUCT.id);
    if (INDEX != -1) {
      this.toastr.error("Validacion", "El producto ya existe en la lista");
      return;
    }
    COMPARES.push(TRADING_PRODUCT);
    this.toastr.success("Exito", "El producto se agrego a lista de comparacion");
    localStorage.setItem("compares", JSON.stringify(COMPARES));
    if (COMPARES.length > 1) {
      this.router.navigateByUrl("/compare-product");
    }
  }

  openDetailProduct(PRODUCT: any, DISCOUNT_FLASH: any = null) {
    this.product_selected = null;
    this.variation_selected = null;
    setTimeout(() => {
      setTimeout(() => {
        if (DISCOUNT_FLASH) {
          this.product_selected.discount_g = DISCOUNT_FLASH;
        }
      }, 25);
      this.product_selected = PRODUCT;
    }, 50);
  }
}
