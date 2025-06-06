export interface Advertisement {
  id: string;
  title: string;
  description: string;
  image: string;
  buttonText: string;
  link: string;
  company: string;
  type: "product" | "service" | "app" | "premium";
}
