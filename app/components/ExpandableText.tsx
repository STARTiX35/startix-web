'use client';

import React, { FC, useCallback, useEffect, useId, useRef, useState } from 'react';

interface ExpandableTextProps {
  /** 表示する本文。改行を含む CMS 由来のテキストをそのまま渡す */
  text: string;
  /** <p> に付けるクラス。フォントサイズや色は呼び出し側の意匠に合わせる */
  className?: string;
}

/**
 * 長い本文を3行で折り畳み、溢れているときだけ「もっと見る」を出すコンポーネント。
 *
 * イベントの説明文は CMS 側で長さが揃わない（実測で 26 文字から 382 文字、
 * 折り返すと 2 行から 17 行）。全文をそのまま流すとカードの高さがばらつき、
 * ページ全体が間延びする。
 *
 * 溢れているかどうかはマウント後に scrollHeight と clientHeight を比べて決める。
 * 文字数で判定すると、フォント・画面幅・改行位置で実際の行数が変わるため当たらない。
 * 折り返しは画面幅で変わるので ResizeObserver で測り直す。
 */
const ExpandableText: FC<ExpandableTextProps> = ({ text, className = '' }) => {
  const textRef = useRef<HTMLParagraphElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const bodyId = useId();

  const measure = useCallback(() => {
    const element = textRef.current;
    if (!element) return;
    // 展開中は clientHeight が全文まで伸びていて比較にならないため測らない。
    // 折り畳みに戻した時点で改めて測り直される。
    if (isExpanded) return;
    // 端数の丸めで 1px 程度の差が出ることがあるので、しきい値に余裕を持たせる
    setIsOverflowing(element.scrollHeight > element.clientHeight + 1);
  }, [isExpanded]);

  useEffect(() => {
    measure();

    const element = textRef.current;
    if (!element || typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [measure, text]);

  return (
    <div>
      <p
        ref={textRef}
        id={bodyId}
        className={`${className} ${isExpanded ? '' : 'line-clamp-3'}`}
      >
        {text}
      </p>
      {/* 3行に収まっている本文にボタンを出すと意味のない操作が増えるので、
          溢れているときだけ描画する。判定は JS 実行後なので、
          JS が無効な環境では折り畳みのみ効いてボタンは出ない */}
      {isOverflowing && (
        <button
          type="button"
          onClick={() => setIsExpanded((prev) => !prev)}
          aria-expanded={isExpanded}
          aria-controls={bodyId}
          className="mt-2 text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
        >
          {isExpanded ? '閉じる' : 'もっと見る'}
        </button>
      )}
    </div>
  );
};

export default ExpandableText;
