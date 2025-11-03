"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import type { ComponentPropsWithoutRef } from "react";

// 現在のページ階層に応じて "../" を付与し、サイト内リンクを相対パスへ変換するラッパーです。

type RelativeLinkProps = ComponentPropsWithoutRef<typeof Link>;

const buildPrefix = (pathname: string) => {
  const depth = pathname.split("/").filter(Boolean).length;
  if (depth === 0) {
    return "";
  }
  return "../".repeat(depth);
};

const toRelativeHref = (pathname: string, target: string) => {
  const normalized = target.trim();
  if (normalized.startsWith("#")) {
    return normalized;
  }
  const sanitized = normalized.replace(/^\/+/, "");
  const prefix = buildPrefix(pathname);
  if (sanitized.length === 0) {
    return prefix.length === 0 ? "./" : prefix;
  }
  return `${prefix}${sanitized}`;
};

export default function RelativeLink({
  href,
  ...props
}: RelativeLinkProps) {
  const pathname = usePathname() ?? "/";
  const resolvedHref = useMemo(() => {
    if (typeof href !== "string") {
      return href;
    }
    return toRelativeHref(pathname, href);
  }, [href, pathname]);

  return <Link {...props} href={resolvedHref} />;
}
