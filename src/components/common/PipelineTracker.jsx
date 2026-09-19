import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const LIFECYCLE_STAGES = [
  { id: 'client', label: 'Lead / Client', route: '/clients' },
  { id: 'onboarding', label: 'Onboarding', route: '/clients' },
  { id: 'order', label: 'Package / Order', route: '/orders' },
  { id: 'scripting', label: 'Scripting', route: '/scripts' },
  { id: 'creator', label: 'Creator Match', route: '/creators' },
  { id: 'shoot', label: 'Shoot', route: '/shoots' },
  { id: 'editing', label: 'Editing', route: '/videos' },
  { id: 'review', label: 'Client Review', route: '/videos' },
  { id: 'revision', label: 'Revision', route: '/videos' },
  { id: 'delivery', label: 'Final Delivery', route: '/videos' },
  { id: 'payout', label: 'Payout & Reports', route: '/creator-payouts' }
];

export default function PipelineTracker({ activeStageId, onSelectStage }) {
  const activeIndex = LIFECYCLE_STAGES.findIndex(s => s.id === activeStageId);

  return (
    <div className="w-full bg-white rounded-2xl p-4 border border-stone-200/80 shadow-xs overflow-x-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            End-to-End UGC Operational Lifecycle
          </h4>
        </div>
        <span className="text-[11px] font-medium text-stone-500 hidden sm:inline">
          Leadyfy Automated Production Blueprint
        </span>
      </div>

      <div className="flex items-center min-w-max gap-1">
        {LIFECYCLE_STAGES.map((stage, idx) => {
          const isPassed = activeIndex !== -1 && idx < activeIndex;
          const isCurrent = stage.id === activeStageId;

          let stateClasses = 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100';
          if (isCurrent) {
            stateClasses = 'bg-stone-900 text-amber-400 border-stone-900 font-bold shadow-xs';
          } else if (isPassed) {
            stateClasses = 'bg-amber-50 text-amber-900 border-amber-200 font-semibold';
          }

          return (
            <React.Fragment key={stage.id}>
              <div
                onClick={() => onSelectStage && onSelectStage(stage)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all cursor-pointer whitespace-nowrap ${stateClasses}`}
                title={`Workflow step: ${stage.label}`}
              >
                {isPassed && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                <span>{stage.label}</span>
              </div>
              {idx < LIFECYCLE_STAGES.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-stone-300 shrink-0 mx-0.5" />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
