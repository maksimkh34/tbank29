import React, {useEffect, useRef, useState} from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';

import 'dmn-js/dist/assets/diagram-js.css';
import 'dmn-js/dist/assets/dmn-js-shared.css';
import 'dmn-js/dist/assets/dmn-js-drd.css';
import 'dmn-js/dist/assets/dmn-js-decision-table.css';
import 'dmn-js/dist/assets/dmn-js-literal-expression.css';
import 'dmn-js/dist/assets/dmn-js-boxed-expression.css';
import 'dmn-js/dist/assets/dmn-font/css/dmn.css';

type DmnViewerProps = {
  url: string;
  height?: number | string;
};

type DmnActiveViewer = {
  get?: (name: string) => any;
};

function DmnViewerClient({url, height = 650}: DmnViewerProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const resolvedUrl = useBaseUrl(url);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let viewer: any = null;
    let cancelled = false;

    async function renderDiagram() {
      setError(null);

      const DmnJS = (await import('dmn-js/lib/NavigatedViewer')).default;

      if (cancelled || !containerRef.current) {
        return;
      }

      const dmnViewer: {
        destroy: () => void;
        importXML: (xml: string) => Promise<void>;
        getActiveViewer?: () => DmnActiveViewer | null;
      } = new DmnJS({
        container: containerRef.current,
      });
      viewer = dmnViewer;

      const response = await fetch(resolvedUrl);

      if (!response.ok) {
        throw new Error(`Не удалось загрузить DMN-файл: ${response.status} ${response.statusText}`);
      }

      const xml = await response.text();

      await dmnViewer.importXML(xml);

      const activeViewer = dmnViewer.getActiveViewer?.();
      const canvas = activeViewer?.get?.('canvas');

      if (canvas?.zoom) {
        canvas.zoom('fit-viewport');
      }
    }

    renderDiagram().catch((renderError: unknown) => {
      console.error('Failed to render DMN diagram', renderError);

      if (!cancelled) {
        setError(renderError instanceof Error ? renderError.message : 'Не удалось отобразить DMN-диаграмму');
      }
    });

    return () => {
      cancelled = true;

      if (viewer) {
        viewer.destroy();
      }
    };
  }, [resolvedUrl]);

  return (
    <div>
      {error && (
        <div
          style={{
            marginBottom: 12,
            padding: 12,
            border: '1px solid var(--ifm-color-danger)',
            borderRadius: 8,
            color: 'var(--ifm-color-danger-dark)',
          }}>
          {error}
        </div>
      )}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height,
          border: '1px solid var(--ifm-color-emphasis-300)',
          borderRadius: 8,
          overflow: 'auto',
          background: 'white',
        }}
      />
    </div>
  );
}

export default function DmnViewer(props: DmnViewerProps): React.ReactElement {
  return (
    <BrowserOnly fallback={<div>Загрузка DMN-диаграммы...</div>}>
      {() => <DmnViewerClient {...props} />}
    </BrowserOnly>
  );
}
