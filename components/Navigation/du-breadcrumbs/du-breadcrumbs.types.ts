import type { Component } from "vue";

export interface DuBreadcrumbItem {
  label: string;
  href?: string;
  icon?: string;
}

export interface DuBreadcrumbsProps {
  items: DuBreadcrumbItem[];
  separator?: string;
  as?: string | Component;
} 