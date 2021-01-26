F=F or CreateFrame("frame");
F:RegisterEvent("UNIT_SPELLCAST_SUCCEEDED"); 
F:SetScript("OnEvent", function()
  if arg1=="player" and arg2=="技能名"
    then SendChatMessage("X你要说的话X","yell") 
    end
  end)