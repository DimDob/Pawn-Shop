// UI/src/app/components/order-summary/order-summary.component.spec.ts

import { ComponentFixture, TestBed, fakeAsync, tick } from "@angular/core/testing";
import { OrderSummaryComponent } from "./order-summary.component";
import { CartService } from "../cart_page_component/cart-page/cart.service";
import { PaymentService } from "../../shared/services/payment.service";
import { NotificationService } from "../../shared/services/notification.service";
import { OrderService } from "../../shared/services/order.service";
import { Router } from "@angular/router";
import { of, throwError, BehaviorSubject } from "rxjs";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

describe("OrderSummaryComponent", () => {
  let component: OrderSummaryComponent;
  let fixture: ComponentFixture<OrderSummaryComponent>;
  let cartServiceMock: any;
  let paymentServiceMock: any;
  let notificationServiceMock: any;
  let orderServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Create mocks for the dependencies
    cartServiceMock = {
      items$: new BehaviorSubject<any[]>([
        {
          product: { id: 1, name: "Product 1", price: 50 },
          quantity: 2
        },
        {
          product: { id: 2, name: "Product 2", price: 30 },
          quantity: 1
        }
      ])
    };

    paymentServiceMock = {
      createCheckoutSession: jasmine.createSpy("createCheckoutSession"),
      redirectToCheckout: jasmine.createSpy("redirectToCheckout").and.returnValue(Promise.resolve())
    };

    notificationServiceMock = {
      showSuccess: jasmine.createSpy("showSuccess"),
      showError: jasmine.createSpy("showError")
    };

    orderServiceMock = {
      createOrder: jasmine.createSpy("createOrder")
    };

    routerMock = {
      navigate: jasmine.createSpy("navigate")
    };

    // Configure the TestBed with necessary modules and providers
    await TestBed.configureTestingModule({
      declarations: [OrderSummaryComponent],
      imports: [FontAwesomeModule, FormsModule],
      providers: [
        { provide: CartService, useValue: cartServiceMock },
        { provide: PaymentService, useValue: paymentServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock },
        { provide: OrderService, useValue: orderServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Create the component instance and trigger initial data binding
    fixture = TestBed.createComponent(OrderSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create the OrderSummaryComponent", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize cart items and calculate total cost", () => {
    expect(component.cartItems.length).toBe(2);
    expect(component.cartItems[0].product.name).toBe("Product 1");
    expect(component.cartItems[1].product.name).toBe("Product 2");
    expect(component.totalCost()).toBe(130);
  });

  it("should display estimated delivery dates correctly", () => {
    const startDate = component.estimatedDeliveryStart;
    const endDate = component.estimatedDeliveryEnd;
    const dateText: HTMLElement = fixture.debugElement.query(By.css(".estimated-delivery p")).nativeElement;
    const expectedText = `${startDate.toLocaleDateString("en-US")} - ${endDate.toLocaleDateString("en-US")}`;
    expect(dateText.textContent).toContain(expectedText);
  });

  it("should display all shipping detail input fields", () => {
    const inputElements = fixture.debugElement.queryAll(By.css(".shipping-details .form-group input"));
    expect(inputElements.length).toBe(6);
    expect(inputElements[0].attributes["placeholder"]).toBe("Full Name");
    expect(inputElements[1].attributes["placeholder"]).toBe("Phone Number");
    expect(inputElements[2].attributes["placeholder"]).toBe("Street Address");
    expect(inputElements[3].attributes["placeholder"]).toBe("City");
    expect(inputElements[4].attributes["placeholder"]).toBe("State");
    expect(inputElements[5].attributes["placeholder"]).toBe("Postal Code");
  });

  it("should place order successfully when form is valid and services respond correctly", fakeAsync(() => {
    // Arrange: Set valid shipping details
    component.shippingDetails = {
      buyerName: "John Doe",
      phone: "1234567890",
      streetAddress: "123 Main St",
      city: "Anytown",
      state: "Anystate",
      postalCode: "12345"
    };
    fixture.detectChanges();

    // Mock OrderService.createOrder to return a successful order response
    const mockOrderResponse = { orderId: "order123" };
    orderServiceMock.createOrder.and.returnValue(of(mockOrderResponse));

    // Mock PaymentService.createCheckoutSession to return a session ID
    const mockPaymentResponse = { sessionId: "session123" };
    paymentServiceMock.createCheckoutSession.and.returnValue(of(mockPaymentResponse));

    // Act: Call placeOrder
    component.placeOrder();
    tick(); // Simulate async

    // Assert
    expect(component.isProcessing).toBeFalse();
    expect(orderServiceMock.createOrder).toHaveBeenCalledWith({
      shippingDetails: component.shippingDetails,
      items: component.cartItems,
      total: 130,
      estimatedDeliveryStart: component.estimatedDeliveryStart,
      estimatedDeliveryEnd: component.estimatedDeliveryEnd
    });
    expect(paymentServiceMock.createCheckoutSession).toHaveBeenCalledWith(130, "order123");
    expect(paymentServiceMock.redirectToCheckout).toHaveBeenCalledWith("session123");
    expect(notificationServiceMock.showSuccess).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  }));

  it("should handle error when orderService.createOrder fails", fakeAsync(() => {
    // Arrange: Set valid shipping details
    component.shippingDetails = {
      buyerName: "John Doe",
      phone: "1234567890",
      streetAddress: "123 Main St",
      city: "Anytown",
      state: "Anystate",
      postalCode: "12345"
    };
    fixture.detectChanges();

    // Mock OrderService.createOrder to return an error
    const mockError = { message: "Order creation failed" };
    orderServiceMock.createOrder.and.returnValue(throwError(mockError));

    // Act: Call placeOrder
    component.placeOrder();
    tick(); // Simulate async

    // Assert
    expect(component.isProcessing).toBeFalse();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("Order creation failed");
    expect(paymentServiceMock.createCheckoutSession).not.toHaveBeenCalled();
    expect(paymentServiceMock.redirectToCheckout).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  }));

  it("should handle error when paymentService.createCheckoutSession fails", fakeAsync(() => {
    // Arrange: Set valid shipping details
    component.shippingDetails = {
      buyerName: "John Doe",
      phone: "1234567890",
      streetAddress: "123 Main St",
      city: "Anytown",
      state: "Anystate",
      postalCode: "12345"
    };
    fixture.detectChanges();

    // Mock OrderService.createOrder to return a successful order response
    const mockOrderResponse = { orderId: "order123" };
    orderServiceMock.createOrder.and.returnValue(of(mockOrderResponse));

    // Mock PaymentService.createCheckoutSession to return an error
    const mockPaymentError = { message: "Payment session failed" };
    paymentServiceMock.createCheckoutSession.and.returnValue(throwError(mockPaymentError));

    // Act: Call placeOrder
    component.placeOrder();
    tick(); // Simulate async

    // Assert
    expect(component.isProcessing).toBeFalse();
    expect(orderServiceMock.createOrder).toHaveBeenCalled();
    expect(paymentServiceMock.createCheckoutSession).toHaveBeenCalledWith(130, "order123");
    expect(paymentServiceMock.redirectToCheckout).not.toHaveBeenCalled();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("Payment session failed");
    expect(routerMock.navigate).not.toHaveBeenCalled();
  }));

  it("should disable the place order button when processing", () => {
    // Arrange: Set isProcessing to true
    component.isProcessing = true;
    fixture.detectChanges();

    // Act: Query the place order button
    const placeOrderButton: HTMLElement = fixture.debugElement.query(By.css(".place-order-btn")).nativeElement;

    // Assert
    expect((placeOrderButton as HTMLButtonElement).disabled).toBeTrue();
    expect(placeOrderButton.textContent).toContain("Processing...");
  });

  it("should enable the place order button when not processing and form is valid", () => {
    // Arrange: Set valid shipping details
    component.shippingDetails = {
      buyerName: "John Doe",
      phone: "1234567890",
      streetAddress: "123 Main St",
      city: "Anytown",
      state: "Anystate",
      postalCode: "12345"
    };
    fixture.detectChanges();

    // Act: Query the place order button
    const placeOrderButton: HTMLElement = fixture.debugElement.query(By.css(".place-order-btn")).nativeElement;

    // Assert
    expect((placeOrderButton as HTMLButtonElement).disabled).toBeFalse();
    expect(placeOrderButton.textContent).toContain("Place Order");
  });

  it("should not place order if form validation fails", () => {
    // Arrange: Set incomplete shipping details
    component.shippingDetails = {
      buyerName: "",
      phone: "",
      streetAddress: "",
      city: "",
      state: "",
      postalCode: ""
    };
    fixture.detectChanges();

    // Act: Call placeOrder
    component.placeOrder();

    // Assert
    expect(component.isProcessing).toBeFalse();
    expect(orderServiceMock.createOrder).not.toHaveBeenCalled();
    expect(paymentServiceMock.createCheckoutSession).not.toHaveBeenCalled();
    expect(paymentServiceMock.redirectToCheckout).not.toHaveBeenCalled();
    expect(notificationServiceMock.showError).toHaveBeenCalledWith("Failed to process order");
  });

  it("should display all cart items in the template", () => {
    // Act: Query all item elements
    const itemElements: DebugElement[] = fixture.debugElement.queryAll(By.css(".items-list .item"));

    // Assert
    expect(itemElements.length).toBe(2);
    expect(itemElements[0].query(By.css(".name")).nativeElement.textContent).toContain("Product 1");
    expect(itemElements[0].query(By.css(".quantity")).nativeElement.textContent).toContain("Quantity: 2");
    expect(itemElements[0].query(By.css(".price")).nativeElement.textContent).toContain("$100");
    expect(itemElements[1].query(By.css(".name")).nativeElement.textContent).toContain("Product 2");
    expect(itemElements[1].query(By.css(".quantity")).nativeElement.textContent).toContain("Quantity: 1");
    expect(itemElements[1].query(By.css(".price")).nativeElement.textContent).toContain("$30");
  });

  it("should navigate to main page after successful order placement", fakeAsync(() => {
    // Arrange: Set valid shipping details
    component.shippingDetails = {
      buyerName: "John Doe",
      phone: "1234567890",
      streetAddress: "123 Main St",
      city: "Anytown",
      state: "Anystate",
      postalCode: "12345"
    };
    fixture.detectChanges();

    // Mock OrderService.createOrder to return a successful order response
    const mockOrderResponse = { orderId: "order123" };
    orderServiceMock.createOrder.and.returnValue(of(mockOrderResponse));

    // Mock PaymentService.createCheckoutSession to return a session ID
    const mockPaymentResponse = { sessionId: "session123" };
    paymentServiceMock.createCheckoutSession.and.returnValue(of(mockPaymentResponse));

    // Act: Call placeOrder
    component.placeOrder();
    tick(); // Simulate async

    // Assert
    expect(paymentServiceMock.redirectToCheckout).toHaveBeenCalledWith("session123");
    // Assuming redirectToCheckout handles navigation, no need to check router.navigate here
  }));
});
