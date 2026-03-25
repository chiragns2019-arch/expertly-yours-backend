function Heading() {
  return (
    <div className="h-[28px] relative shrink-0 w-full" data-name="Heading 3">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[28px] left-0 not-italic text-[#1b1b1b] text-[18px] top-[-1px]">{`Pricing & Rates`}</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[20px] min-h-px min-w-px not-italic relative text-[#4a5565] text-[14px] whitespace-pre-wrap">Set your rates for different engagement types. Pricing is optional and you can choose to show or hide it on your profile.</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#6a7282] text-[12px] whitespace-pre-wrap">💡 Not applicable for: Pro bono, Networking only, and Equity/Co-founder engagements</p>
    </div>
  );
}

function Container() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[8px] h-[80px] items-start left-0 top-0 w-[1006px]" data-name="Container">
      <Heading />
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Label() {
  return (
    <div className="absolute content-stretch flex h-[20px] items-start left-0 top-[104px] w-[1006px]" data-name="Label">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-h-px min-w-px not-italic relative text-[#255fba] text-[14px] whitespace-pre-wrap">Select engagement types you want to set pricing for (optional)</p>
    </div>
  );
}

function Checkbox() {
  return <div className="shrink-0 size-[16px]" data-name="Checkbox" />;
}

function Text() {
  return (
    <div className="h-[20px] relative shrink-0 w-[96.313px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#1b1b1b] text-[14px]">Paid Consulting</p>
      </div>
    </div>
  );
}

function Label1() {
  return (
    <div className="absolute bg-[#a8ff36] content-stretch flex gap-[12px] h-[46px] items-center left-0 pl-[13px] pr-px py-px rounded-[10px] top-[136px] w-[499px]" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#a8ff36] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Checkbox />
      <Text />
    </div>
  );
}

function Checkbox1() {
  return <div className="shrink-0 size-[16px]" data-name="Checkbox" />;
}

function Text1() {
  return (
    <div className="h-[20px] relative shrink-0 w-[111.297px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#1b1b1b] text-[14px]">Hourly Consulting</p>
      </div>
    </div>
  );
}

function Label2() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[46px] items-center left-0 pl-[13px] pr-px py-px rounded-[10px] top-[356px] w-[499px]" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Checkbox1 />
      <Text1 />
    </div>
  );
}

function Checkbox2() {
  return <div className="shrink-0 size-[16px]" data-name="Checkbox" />;
}

function Text2() {
  return (
    <div className="h-[20px] relative shrink-0 w-[50.656px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#1b1b1b] text-[14px]">Retainer</p>
      </div>
    </div>
  );
}

function Label3() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[46px] items-center left-0 pl-[13px] pr-px py-px rounded-[10px] top-[190px] w-[499px]" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Checkbox2 />
      <Text2 />
    </div>
  );
}

function Checkbox3() {
  return <div className="shrink-0 size-[16px]" data-name="Checkbox" />;
}

function Text3() {
  return (
    <div className="h-[20px] relative shrink-0 w-[53.156px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#1b1b1b] text-[14px]">Advisory</p>
      </div>
    </div>
  );
}

function Label4() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[46px] items-center left-0 pl-[13px] pr-px py-px rounded-[10px] top-[410px] w-[499px]" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Checkbox3 />
      <Text3 />
    </div>
  );
}

function Checkbox4() {
  return <div className="shrink-0 size-[16px]" data-name="Checkbox" />;
}

function Text4() {
  return (
    <div className="h-[20px] relative shrink-0 w-[130.859px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#1b1b1b] text-[14px]">Fractional Leadership</p>
      </div>
    </div>
  );
}

function Label5() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[46px] items-center left-0 pl-[13px] pr-px py-px rounded-[10px] top-[244px] w-[499px]" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Checkbox4 />
      <Text4 />
    </div>
  );
}

function Checkbox5() {
  return <div className="shrink-0 size-[16px]" data-name="Checkbox" />;
}

function Text5() {
  return (
    <div className="h-[20px] relative shrink-0 w-[138.844px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#1b1b1b] text-[14px]">Part-time Employment</p>
      </div>
    </div>
  );
}

function Label6() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[46px] items-center left-0 pl-[13px] pr-px py-px rounded-[10px] top-[464px] w-[499px]" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Checkbox5 />
      <Text5 />
    </div>
  );
}

function Checkbox6() {
  return <div className="shrink-0 size-[16px]" data-name="Checkbox" />;
}

function Text6() {
  return (
    <div className="h-[20px] relative shrink-0 w-[136.281px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Regular',sans-serif] font-normal leading-[20px] not-italic relative shrink-0 text-[#1b1b1b] text-[14px]">Full-time Employment</p>
      </div>
    </div>
  );
}

function Label7() {
  return (
    <div className="absolute content-stretch flex gap-[12px] h-[46px] items-center left-0 pl-[13px] pr-px py-px rounded-[10px] top-[298px] w-[499px]" data-name="Label">
      <div aria-hidden="true" className="absolute border border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[10px]" />
      <Checkbox6 />
      <Text6 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="absolute h-[24px] left-[621px] top-[134px] w-[954px]" data-name="Heading 4">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[24px] left-0 not-italic text-[#1b1b1b] text-[16px] top-[-2px]">Paid/Hourly Consulting</p>
    </div>
  );
}

function Label8() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-h-px min-w-px not-italic relative text-[#255fba] text-[14px] whitespace-pre-wrap">Choose Pricing Model</p>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#1b1b1b] text-[16px] top-[-2px]">Per Session</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#4a5565] text-[12px] whitespace-pre-wrap">Charge by session length</p>
    </div>
  );
}

function Button() {
  return (
    <div className="col-1 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#e5e7eb] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[2px] pt-[18px] px-[18px] relative size-full">
        <Container3 />
        <Container4 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="h-[24px] relative shrink-0 w-full" data-name="Container">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[24px] left-0 not-italic text-[#1b1b1b] text-[16px] top-[-2px]">Per Hour</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="content-stretch flex h-[16px] items-start relative shrink-0 w-full" data-name="Container">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[16px] min-h-px min-w-px not-italic relative text-[#4a5565] text-[12px] whitespace-pre-wrap">Charge hourly rate</p>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#a8ff36] col-2 justify-self-stretch relative rounded-[14px] row-1 self-stretch shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-2 border-[#a8ff36] border-solid inset-0 pointer-events-none rounded-[14px]" />
      <div className="content-stretch flex flex-col gap-[4px] items-start pb-[2px] pt-[18px] px-[18px] relative size-full">
        <Container5 />
        <Container6 />
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="gap-x-[12px] gap-y-[12px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[80px] relative shrink-0 w-full" data-name="Container">
      <Button />
      <Button1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[12px] h-[112px] items-start left-[621px] top-[182px] w-[501px]" data-name="Container">
      <Label8 />
      <Container2 />
    </div>
  );
}

function Label9() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-h-px min-w-px not-italic relative text-[#255fba] text-[14px] whitespace-pre-wrap">Hourly Rate</p>
    </div>
  );
}

function TextInput() {
  return (
    <div className="h-[50px] relative rounded-[14px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)]">$200/hour</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container9() {
  return (
    <div className="col-1 content-stretch flex flex-col gap-[8px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Label9 />
      <TextInput />
    </div>
  );
}

function Label10() {
  return (
    <div className="content-stretch flex h-[20px] items-start relative shrink-0 w-full" data-name="Label">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[20px] min-h-px min-w-px not-italic relative text-[#255fba] text-[14px] whitespace-pre-wrap">Minimum Commitment</p>
    </div>
  );
}

function TextInput1() {
  return (
    <div className="h-[50px] relative rounded-[14px] shrink-0 w-full" data-name="Text Input">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[16px] py-[12px] relative size-full">
          <p className="font-['Inter:Regular',sans-serif] font-normal leading-[normal] not-italic relative shrink-0 text-[16px] text-[rgba(10,10,10,0.5)]">e.g., 10 hours/month</p>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d1d5dc] border-solid inset-0 pointer-events-none rounded-[14px]" />
    </div>
  );
}

function Container10() {
  return (
    <div className="col-2 content-stretch flex flex-col gap-[8px] items-start justify-self-stretch relative row-1 self-stretch shrink-0" data-name="Container">
      <Label10 />
      <TextInput1 />
    </div>
  );
}

function Container8() {
  return (
    <div className="gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(2,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[78px] relative shrink-0 w-full" data-name="Container">
      <Container9 />
      <Container10 />
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex flex-col h-[271px] items-start left-[621px] pb-px top-[369px] w-[520px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e5e7eb] border-b border-solid inset-0 pointer-events-none" />
      <Container8 />
    </div>
  );
}

export default function Group() {
  return (
    <div className="relative size-full">
      <Container />
      <Label />
      <Label1 />
      <Label2 />
      <Label3 />
      <Label4 />
      <Label5 />
      <Label6 />
      <Label7 />
      <Heading1 />
      <Container1 />
      <Container7 />
    </div>
  );
}