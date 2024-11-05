import { Observable, of } from 'rxjs';

export class MockClientProxy {
  send = jest.fn((pattern: any, data: any): Observable<any> => {
    if (typeof pattern === 'object') {
      switch (pattern.cmd) {
        case 'createUser':
          return of({ id: '1', username: data.username });
        case 'getUserById':
          if (data.userId === '1') {
            return of({ id: '1', username: 'testuser' });
          }
          return of(null);
        case 'getAllUsers':
          return of([{ id: '1', username: 'testuser' }]);
        case 'isJWTValid':
          return of(true);
        case 'createPayment':
          return of({
              paymentId: 'p1',
              amount: 100,
              label: 'test_label',
              user: {}
          });
        case 'getUserPayments':
          return of([{ paymentId: 'p1', amount: 100 }]);
        case 'getAllPayments':
          return of([{ paymentId: 'p1', amount: 100 }, { paymentId: 'p2', amount: 200 }]);
        default:
          return of(null);
      }
    } else if (typeof pattern === 'string') {
      switch (pattern) {
        case 'createPayment':
          return of({
            paymentId: 'p1',
            amount: 100,
            label: 'test_label',
            user: {}
          });
        default:
          return of(null);
      }
    }
      
    
  });
}
