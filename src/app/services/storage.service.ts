import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  private keyPrefix = "academy:";

  get(key: string, defaultValue?: any): any {
    const value = localStorage.getItem(this.keyPrefix + key);
    if (value !== null) {
      try {
        return JSON.parse(value);
      } catch (e) {}
    }
    return defaultValue;
  }

  set(key: string, value: any) {
    localStorage.setItem(this.keyPrefix + key, JSON.stringify(value));
  }

  remove(key: string) {
    localStorage.removeItem(this.keyPrefix + key);
  }
}
